import Foundation
import XCTest
@testable import SaunaCore

private struct UpgradedChannelsFixture: Decodable {
    struct Canonical: Decodable { let startedAt: Int64; let advanceTo: Int64; let seed: Int64 }
    struct Input: Decodable {
        struct Master: Decodable {
            let name: String; let style: String; let heatCraft: Int; let aromaCraft: Int
            let performanceCraft: Int; let weeklyWage: Double; let equipment: [String]
        }
        struct Schedule: Decodable { let openDays: Int; let opensAt: Double; let closesAt: Double }
        let cash: Double; let built: [String]; let condition: [String: Double]; let masterHired: Bool
        let master: Master; let admissionPrice: Double; let schedule: Schedule; let recoveryFinish: String
    }
    struct Expected: Decodable {
        let week: Int; let cash: Double; let admissions: Int; let specialSeats: Int; let specialCapacity: Int
        let specialDemand: Int; let walkUpSeats: Int; let turnedAwayFromGus: Int; let shopSales: Int
        let shopRevenue: Double; let shopProcurement: Double; let recoveryDemand: Int; let queueLoss: Int
        let admissionRevenue: Double; let specialRevenue: Double; let revenue: Double; let operatingCosts: Double
        let netResult: Double; let condition: [String: Double]; let runtimeClearedAtBoundary: Bool
    }
    let fixtureVersion: Int; let name: String; let canonical: Canonical; let input: Input; let expected: Expected
}

final class UpgradedChannelsFixtureParityTests: XCTestCase {
    private func fixtureURL() -> URL {
        var url = URL(fileURLWithPath: #filePath)
        for _ in 0..<5 { url.deleteLastPathComponent() }
        return url.appendingPathComponent("src/sim/fixtures/canal-upgraded-channels-v1.json")
    }

    func testNativeUpgradedChannelsMatchSharedFixture() throws {
        let fixture = try JSONDecoder().decode(UpgradedChannelsFixture.self, from: Data(contentsOf: fixtureURL()))
        let m = fixture.input.master
        var program = ActiveProgram.starter
        program.recoveryFinish = .coldPlunge
        XCTAssertEqual(fixture.input.recoveryFinish, program.recoveryFinish.rawValue)
        let world = CanalWorldState(
            cash: fixture.input.cash,
            built: Set(fixture.input.built),
            master: fixture.input.masterHired ? MasterProfile(
                name: m.name, style: m.style, heatCraft: m.heatCraft, aromaCraft: m.aromaCraft,
                performanceCraft: m.performanceCraft, weeklyWage: m.weeklyWage, equipment: m.equipment
            ) : nil,
            admissionPrice: fixture.input.admissionPrice,
            schedule: VenueSchedule(
                openDays: fixture.input.schedule.openDays,
                opensAt: fixture.input.schedule.opensAt,
                closesAt: fixture.input.schedule.closesAt
            ),
            program: program,
            condition: fixture.input.condition
        )
        let initial = CanalCanonicalRuntime.createEnvelope(
            world: world,
            startedAt: fixture.canonical.startedAt,
            seed: fixture.canonical.seed
        )

        let beforeBoundary = try CanalCanonicalRuntime.advance(initial, to: fixture.canonical.advanceTo - 1).envelope
        let runtime = try XCTUnwrap(beforeBoundary.world.operatingRuntime)
        XCTAssertEqual(runtime.accruedAdmissions, fixture.expected.admissions)
        XCTAssertEqual(runtime.accruedSpecialSeats, fixture.expected.specialSeats)
        XCTAssertEqual(runtime.accruedSpecialCapacity, fixture.expected.specialCapacity)
        XCTAssertEqual(runtime.accruedSpecialProgrammeDemand, fixture.expected.specialDemand)
        XCTAssertEqual(runtime.accruedSpecialWalkUpSeats, fixture.expected.walkUpSeats)
        XCTAssertEqual(runtime.accruedSpecialTurnedAway, fixture.expected.turnedAwayFromGus)
        XCTAssertEqual(runtime.accruedShopSales, fixture.expected.shopSales)
        XCTAssertEqual(runtime.accruedRevenue.shop, fixture.expected.shopRevenue)
        XCTAssertEqual(runtime.accruedCosts.shopProcurement, fixture.expected.shopProcurement)
        XCTAssertEqual(runtime.accruedRecoveryDemand, fixture.expected.recoveryDemand)
        XCTAssertEqual(runtime.accruedRecoveryQueueLoss, fixture.expected.queueLoss)
        XCTAssertEqual(runtime.accruedRevenue.admissions, fixture.expected.admissionRevenue)
        XCTAssertEqual(runtime.accruedRevenue.specialGus, fixture.expected.specialRevenue)
        XCTAssertEqual(beforeBoundary.world.world.condition["program"], fixture.expected.condition["program"])
        XCTAssertEqual(beforeBoundary.world.world.condition["shower"], fixture.expected.condition["shower"])
        XCTAssertEqual(beforeBoundary.world.world.condition["cold-plunge"], fixture.expected.condition["cold-plunge"])

        let completed = try CanalCanonicalRuntime.advance(beforeBoundary, to: fixture.canonical.advanceTo).envelope
        let report = try XCTUnwrap(completed.world.world.lastReport)
        XCTAssertEqual(completed.world.world.week, fixture.expected.week)
        XCTAssertEqual(completed.world.world.cash, fixture.expected.cash)
        XCTAssertEqual(report.revenue, fixture.expected.revenue)
        XCTAssertEqual(report.operatingCosts, fixture.expected.operatingCosts)
        XCTAssertEqual(report.netResult, fixture.expected.netResult)
        XCTAssertEqual(completed.world.operatingRuntime == nil, fixture.expected.runtimeClearedAtBoundary)
    }
}
