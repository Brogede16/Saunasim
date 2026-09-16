import XCTest
@testable import SaunaCore

final class CanonicalWearTests: XCTestCase {
    func testProgramWearMutatesConditionWhenGusBlockSettles() throws {
        let start: Int64 = 7_000_000
        let master = MasterProfile(
            name: "Starter Master", style: "Traditional", heatCraft: 3, aromaCraft: 3,
            performanceCraft: 2, weeklyWage: 500, equipment: []
        )
        let world = CanalWorldState(
            cash: 3_350,
            built: ["program"],
            master: master,
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20),
            condition: ["program": 100]
        )
        let initial = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: start, seed: 91)
        let dayZeroClose = CanonicalTime.timestamp(startedAt: start, gameWeek: 1, dayIndex: 0, gameHour: 20)
        let partial = try CanalCanonicalRuntime.advance(initial, to: dayZeroClose).envelope

        let conditionAfterGus = try XCTUnwrap(partial.world.world.condition["program"])
        XCTAssertLessThan(conditionAfterGus, 100)
        let saved = try CanalCanonicalRuntime.decode(CanalCanonicalRuntime.encode(partial))
        XCTAssertEqual(saved.world.world.condition["program"], conditionAfterGus)

        let oneMillisecondLater = try CanalCanonicalRuntime.advance(saved, to: dayZeroClose + 1).envelope
        XCTAssertEqual(oneMillisecondLater.world.world.condition["program"], conditionAfterGus)
    }
}
