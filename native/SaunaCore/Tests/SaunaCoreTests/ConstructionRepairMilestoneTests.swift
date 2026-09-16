import XCTest
@testable import SaunaCore

final class ConstructionRepairMilestoneTests: XCTestCase {
    private let master = MasterProfile(
        name: "Starter Master",
        style: "Traditional",
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: []
    )

    private func baseWorld(
        construction: [CanalConstructionProject] = [],
        built: Set<String> = [],
        condition: [String: Double] = [:],
        repairTask: CanalRepairTask? = nil
    ) -> CanalWorldState {
        CanalWorldState(
            cash: 3_350,
            built: built,
            master: master,
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20),
            construction: construction,
            condition: condition,
            repairTask: repairTask
        )
    }

    func testConstructionCompletesAtCanonicalTimestampAndReplansFutureBlocks() throws {
        let start: Int64 = 4_000_000
        let completion = start + Int64(Double(CanonicalTime.realMillisecondsPerGameWeek) * 0.35)
        let boundary = start + CanonicalTime.realMillisecondsPerGameWeek
        let world = baseWorld(construction: [
            CanalConstructionProject(moduleID: "arrival", completesAt: completion)
        ])
        let initial = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: start, seed: 12)

        let before = try CanalCanonicalRuntime.advance(initial, to: completion - 1).envelope
        XCTAssertFalse(before.world.world.built.contains("arrival"))
        XCTAssertEqual(before.world.world.construction.count, 1)

        let completed = try CanalCanonicalRuntime.advance(before, to: completion)
        XCTAssertTrue(completed.envelope.world.world.built.contains("arrival"))
        XCTAssertTrue(completed.envelope.world.world.construction.isEmpty)
        XCTAssertTrue(completed.events.contains { $0.type == "construction-completed" && $0.detail == "arrival" })

        let final = try CanalCanonicalRuntime.advance(completed.envelope, to: boundary).envelope
        XCTAssertGreaterThan(final.world.world.lastReport?.admissions ?? 0, 70)
    }

    func testRepairCompletesWithoutWaitingForWeekBoundaryAndSurvivesSaveResume() throws {
        let start: Int64 = 5_000_000
        let completion = start + 10_000
        let world = baseWorld(
            built: ["shower"],
            condition: ["shower": 20],
            repairTask: CanalRepairTask(moduleID: "shower", completesAt: completion)
        )
        let initial = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: start, seed: 13)
        let saved = try CanalCanonicalRuntime.decode(CanalCanonicalRuntime.encode(initial))
        let result = try CanalCanonicalRuntime.advance(saved, to: completion)

        XCTAssertEqual(result.envelope.world.world.condition["shower"], 100)
        XCTAssertNil(result.envelope.world.world.repairTask)
        XCTAssertEqual(result.envelope.world.world.week, 1)
        XCTAssertTrue(result.events.contains { $0.type == "repair-completed" && $0.detail == "shower" })
    }

    func testConstructionAtWeekBoundaryResolvesBeforeSettlement() throws {
        let start: Int64 = 6_000_000
        let boundary = start + CanonicalTime.realMillisecondsPerGameWeek
        let world = baseWorld(construction: [
            CanalConstructionProject(moduleID: "arrival", completesAt: boundary)
        ])
        let result = try CanalCanonicalRuntime.advance(
            CanalCanonicalRuntime.createEnvelope(world: world, startedAt: start, seed: 14),
            to: boundary
        )

        let constructionIndex = try XCTUnwrap(result.events.firstIndex { $0.type == "construction-completed" })
        let settlementIndex = try XCTUnwrap(result.events.firstIndex { $0.type == "game-week-settled" })
        XCTAssertLessThan(constructionIndex, settlementIndex)
        XCTAssertTrue(result.envelope.world.world.built.contains("arrival"))
        XCTAssertEqual(result.envelope.world.world.week, 2)
    }
}
