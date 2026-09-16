import Foundation
import XCTest
@testable import SaunaCore

final class OperatingRuntimeTests: XCTestCase {
    private func sampleBlock() -> OperatingBlock {
        OperatingBlock(
            dayIndex: 0,
            daypart: "day",
            startsAt: 11,
            endsAt: 17,
            openHours: 6,
            scheduledAufguss: 1,
            specialCapacity: 8,
            demandWeight: 6.3,
            admissionPrice: 24,
            supplementPrice: 7,
            sessionMaterialCost: 4,
            staffCost: 2.5,
            admissions: 9,
            specialSeats: 7,
            specialProgrammeDemand: 7,
            programSignature: "starter",
            revenue: RevenueBreakdown(admissions: 216, specialGus: 49, shop: 0),
            costs: CostBreakdown(
                venueBase: 12,
                staff: 2.5,
                utilitiesAndCleaning: 12,
                programMaterials: 4,
                shopProcurement: 0,
                facilities: 0
            ),
            operatingNet: 234.5,
            wear: ["program": 2]
        )
    }

    func testSettlingBlockIsIdempotent() {
        let block = sampleBlock()
        let initial = OperatingWeekRuntime(week: 1, plannedBlocks: [block])
        let once = OperatingRuntime.settle(block, into: initial)
        let twice = OperatingRuntime.settle(block, into: once)

        XCTAssertEqual(once, twice)
        XCTAssertEqual(once.accruedAdmissions, 9)
        XCTAssertEqual(once.accruedSpecialSeats, 7)
        XCTAssertEqual(once.accruedSpecialCapacity, 8)
        XCTAssertEqual(once.accruedRevenue.admissions, 216)
        XCTAssertEqual(once.accruedOperatingNet, 234.5)
        XCTAssertEqual(once.settledBlockKeys, ["0:11:17"])
    }

    func testRuntimeRoundTripsThroughCodableWithoutLosingSettledHistory() throws {
        let block = sampleBlock()
        let settled = OperatingRuntime.settle(
            block,
            into: OperatingWeekRuntime(week: 1, plannedBlocks: [block])
        )

        let data = try JSONEncoder().encode(settled)
        let restored = try JSONDecoder().decode(OperatingWeekRuntime.self, from: data)

        XCTAssertEqual(restored, settled)
        XCTAssertTrue(restored.settledBlockKeys.contains(block.key))
    }
}
