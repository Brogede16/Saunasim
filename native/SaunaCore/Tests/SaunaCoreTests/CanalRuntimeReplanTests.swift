import XCTest
@testable import SaunaCore

final class CanalRuntimeReplanTests: XCTestCase {
    private let master = MasterProfile(
        name: "Starter Master",
        style: "Traditional",
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: []
    )

    func testMidweekPriceChangeReplansOnlyFutureBlocks() {
        let startedAt: Int64 = 1_500_000
        let at = startedAt + Int64(Double(CanonicalTime.realMillisecondsPerGameWeek) * 0.35)
        let normal = CanalOperatingInput(
            cash: 3_350,
            built: [],
            master: master,
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20)
        )
        let initialBlocks = CanalBlockPlanner.plan(normal)
        var runtime = OperatingWeekRuntime(week: 1, plannedBlocks: initialBlocks)

        for block in initialBlocks where CanalRuntimeReplan.blockSettlesAt(
            startedAt: startedAt,
            week: 1,
            block: block
        ) <= at {
            runtime = OperatingRuntime.settle(block, into: runtime)
        }

        let settledBefore = runtime.settledBlockKeys
        let admissionsBefore = runtime.accruedAdmissions
        let settledBlocksBefore = runtime.plannedBlocks.filter { settledBefore.contains($0.key) }
        var expensive = normal
        expensive.admissionPrice = 40

        let replanned = CanalRuntimeReplan.replanFuture(
            input: expensive,
            runtime: runtime,
            startedAt: startedAt,
            at: at
        )

        XCTAssertEqual(replanned.settledBlockKeys, settledBefore)
        XCTAssertEqual(replanned.accruedAdmissions, admissionsBefore)
        XCTAssertEqual(
            replanned.plannedBlocks.filter { settledBefore.contains($0.key) },
            settledBlocksBefore
        )

        let oldFutureAdmissions = initialBlocks
            .filter { CanalRuntimeReplan.blockSettlesAt(startedAt: startedAt, week: 1, block: $0) > at }
            .reduce(0) { $0 + $1.admissions }
        let newFutureAdmissions = replanned.plannedBlocks
            .filter { !settledBefore.contains($0.key) }
            .reduce(0) { $0 + $1.admissions }
        XCTAssertLessThan(newFutureAdmissions, oldFutureAdmissions)
    }
}
