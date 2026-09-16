import XCTest
@testable import SaunaCore

final class CanalBlockPlannerTests: XCTestCase {
    private let master = MasterProfile(
        name: "Starter Master",
        style: "Traditional",
        heatCraft: 3,
        aromaCraft: 3,
        performanceCraft: 2,
        weeklyWage: 500,
        equipment: []
    )

    func testStarterWeekIsBuiltFromFifteenDaypartBlocks() {
        let input = CanalOperatingInput(
            cash: 3_350,
            built: [],
            master: master,
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20)
        )
        let blocks = CanalBlockPlanner.plan(input)

        XCTAssertEqual(blocks.count, 15)
        XCTAssertEqual(blocks.reduce(0) { $0 + $1.admissions }, 70)
        XCTAssertEqual(blocks.reduce(0) { $0 + $1.specialSeats }, 14)
        XCTAssertEqual(blocks.reduce(0) { $0 + $1.specialCapacity }, 16)
        XCTAssertEqual(blocks.reduce(0) { $0 + $1.scheduledAufguss }, 2)
        XCTAssertEqual(blocks.reduce(0.0) { $0 + $1.costs.staff }, 5, accuracy: 0.001)
        XCTAssertEqual(
            blocks.reduce(0.0) { $0 + $1.revenue.admissions + $1.revenue.specialGus },
            1_778,
            accuracy: 0.001
        )
        XCTAssertEqual(blocks.filter { $0.scheduledAufguss > 0 }.count, 2)
    }

    func testUnsupportedHigherPriceChangesFuturePlanDemandWithoutChangingContractShape() {
        let normal = CanalOperatingInput(
            cash: 3_350,
            built: [],
            master: master,
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20)
        )
        var expensive = normal
        expensive.admissionPrice = 40

        let normalBlocks = CanalBlockPlanner.plan(normal)
        let expensiveBlocks = CanalBlockPlanner.plan(expensive)

        XCTAssertEqual(normalBlocks.map(\.key), expensiveBlocks.map(\.key))
        XCTAssertLessThan(
            expensiveBlocks.reduce(0) { $0 + $1.admissions },
            normalBlocks.reduce(0) { $0 + $1.admissions }
        )
    }
}
