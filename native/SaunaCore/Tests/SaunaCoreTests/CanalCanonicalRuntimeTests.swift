import XCTest
@testable import SaunaCore

final class CanalCanonicalRuntimeTests: XCTestCase {
    private let master = MasterProfile(
        name: "Starter Master",
        style: "Traditional",
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: []
    )

    private func world(cash: Double = 3_350) -> CanalWorldState {
        CanalWorldState(
            cash: cash,
            built: [],
            master: master,
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20)
        )
    }

    func testFullOfflineWeekMatchesCanonicalStarterFixture() throws {
        let startedAt: Int64 = 1_000_000
        let end = startedAt + CanonicalTime.realMillisecondsPerGameWeek
        let result = try CanalCanonicalRuntime.advance(
            CanalCanonicalRuntime.createEnvelope(world: world(), startedAt: startedAt, seed: 23_063),
            to: end
        ).envelope

        XCTAssertEqual(result.world.world.week, 2)
        XCTAssertEqual(result.world.world.cash, 4_403)
        XCTAssertEqual(result.world.world.lastReport?.admissions, 70)
        XCTAssertEqual(result.world.world.lastReport?.specialSeats, 14)
        XCTAssertEqual(result.world.world.lastReport?.revenue, 1_778)
        XCTAssertEqual(result.world.world.lastReport?.operatingCosts, 725)
        XCTAssertEqual(result.world.world.lastReport?.netResult, 1_053)
        XCTAssertNil(result.world.operatingRuntime)
    }

    func testSaveResumeDoesNotReplaySettledBlocks() throws {
        let startedAt: Int64 = 2_000_000
        let middle = startedAt + CanonicalTime.realMillisecondsPerGameWeek / 2
        let end = startedAt + CanonicalTime.realMillisecondsPerGameWeek
        let initial = CanalCanonicalRuntime.createEnvelope(world: world(), startedAt: startedAt, seed: 12_345)
        let partial = try CanalCanonicalRuntime.advance(initial, to: middle).envelope

        XCTAssertFalse(partial.world.operatingRuntime?.settledBlockKeys.isEmpty ?? true)
        let serialized = try CanalCanonicalRuntime.encode(partial)
        let restored = try CanalCanonicalRuntime.decode(serialized)
        XCTAssertEqual(restored, partial)

        let resumed = try CanalCanonicalRuntime.advance(restored, to: end).envelope
        let uninterrupted = try CanalCanonicalRuntime.advance(initial, to: end).envelope
        XCTAssertEqual(resumed, uninterrupted)
    }

    func testAdvanceThenRepriceThenSaveResumePreservesSettledHistory() throws {
        let startedAt: Int64 = 3_000_000
        let changeAt = startedAt + Int64(Double(CanonicalTime.realMillisecondsPerGameWeek) * 0.35)
        let end = startedAt + CanonicalTime.realMillisecondsPerGameWeek
        let initial = CanalCanonicalRuntime.createEnvelope(world: world(), startedAt: startedAt, seed: 54_321)
        let partial = try CanalCanonicalRuntime.advance(initial, to: changeAt).envelope
        let settledBefore = partial.world.operatingRuntime?.settledBlockKeys ?? []
        let admissionsBefore = partial.world.operatingRuntime?.accruedAdmissions

        var repriced = CanalCanonicalRuntime.setAdmissionPrice(partial, value: 40)
        XCTAssertEqual(repriced.world.operatingRuntime?.settledBlockKeys, settledBefore)
        XCTAssertEqual(repriced.world.operatingRuntime?.accruedAdmissions, admissionsBefore)

        repriced = try CanalCanonicalRuntime.decode(CanalCanonicalRuntime.encode(repriced))
        let completed = try CanalCanonicalRuntime.advance(repriced, to: end).envelope

        XCTAssertEqual(completed.world.world.lastReport?.admissions, 38)
        XCTAssertEqual(completed.world.world.lastReport?.specialSeats, 14)
        XCTAssertEqual(completed.world.world.lastReport?.revenue, 1_170)
        XCTAssertEqual(completed.world.world.lastReport?.operatingCosts, 725)
        XCTAssertEqual(completed.world.world.lastReport?.netResult, 445)
        XCTAssertEqual(completed.world.world.cash, 3_795)
        XCTAssertNil(completed.world.operatingRuntime)
    }
}
