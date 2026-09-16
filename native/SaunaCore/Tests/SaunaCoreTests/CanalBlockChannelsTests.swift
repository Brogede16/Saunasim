import XCTest
@testable import SaunaCore

final class CanalBlockChannelsTests: XCTestCase {
    private let master = MasterProfile(name: "Starter Master", style: "Traditional", heatCraft: 3, aromaCraft: 3, performanceCraft: 2, weeklyWage: 500, equipment: [])

    private func input(
        built: Set<String> = [],
        program: ActiveProgram = .starter,
        condition: [String: Double] = [:],
        repairModuleID: String? = nil,
        shopRange: [String] = ["cold-water", "sauna-towel", "house-blend"]
    ) -> CanalOperatingInput {
        CanalOperatingInput(
            cash: 3_350, built: built, master: master, admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20), program: program,
            shopRange: shopRange, condition: condition, repairModuleID: repairModuleID
        )
    }

    func testShopRequiresPhysicalShopAndPersistsProductLines() {
        XCTAssertEqual(CanalBlockChannels.shop(input: input(), admissions: 20), CanalShopOutcome(sales: 0, revenue: 0, procurement: 0, lines: []))
        let result = CanalBlockChannels.shop(input: input(built: ["shop"]), admissions: 30)
        XCTAssertGreaterThan(result.sales, 0)
        XCTAssertGreaterThan(result.revenue, result.procurement)
        XCTAssertGreaterThan(result.procurement, 0)
        XCTAssertEqual(result.lines.reduce(0) { $0 + $1.units }, result.sales)
    }

    func testShopRangeChangesOutcome() {
        let broad = CanalBlockChannels.shop(input: input(built: ["shop"]), admissions: 40)
        let narrow = CanalBlockChannels.shop(input: input(built: ["shop"], shopRange: ["cold-water"]), admissions: 40)
        XCTAssertNotEqual(broad, narrow)
    }

    func testRecoveryUsesActualSeatsSessionsAndCondition() {
        let none = CanalBlockChannels.recovery(input: input(), scheduledAufguss: 2, specialSeats: 14)
        XCTAssertEqual(none, CanalRecoveryOutcome(recoveryDemand: 0, plungeSlots: 0, showerSlots: 0, queueLoss: 0, bottleneck: nil))

        var coldProgram = ActiveProgram.starter
        coldProgram.recoveryFinish = .coldPlunge
        let healthy = input(built: ["cold-plunge", "shower"], program: coldProgram, condition: ["cold-plunge": 100, "shower": 100])
        let degraded = input(built: ["cold-plunge", "shower"], program: coldProgram, condition: ["cold-plunge": 20, "shower": 20])
        let healthyResult = CanalBlockChannels.recovery(input: healthy, scheduledAufguss: 2, specialSeats: 20)
        let degradedResult = CanalBlockChannels.recovery(input: degraded, scheduledAufguss: 2, specialSeats: 20)
        XCTAssertLessThan(degradedResult.plungeSlots + degradedResult.showerSlots, healthyResult.plungeSlots + healthyResult.showerSlots)
        XCTAssertGreaterThanOrEqual(degradedResult.queueLoss, healthyResult.queueLoss)
    }

    func testWearMatchesTypeScriptCoefficientsAndEligibility() {
        XCTAssertEqual(
            CanalBlockChannels.wear(input: input(built: ["program"], condition: ["program": 100]), specialSeats: 7, recoveryDemand: 0),
            ["program": 1.4]
        )
        XCTAssertEqual(
            CanalBlockChannels.wear(input: input(built: ["shower", "cold-plunge"], condition: ["shower": 100, "cold-plunge": 100]), specialSeats: 0, recoveryDemand: 3),
            ["shower": 3, "cold-plunge": 3]
        )
        XCTAssertTrue(
            CanalBlockChannels.wear(
                input: input(built: ["program", "shower"], condition: ["program": 0, "shower": 40], repairModuleID: "shower"),
                specialSeats: 12,
                recoveryDemand: 4
            ).isEmpty
        )
    }
}
