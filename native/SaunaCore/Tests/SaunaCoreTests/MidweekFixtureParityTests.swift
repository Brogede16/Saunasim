import Foundation
import XCTest
@testable import SaunaCore

private struct MidweekFixture: Decodable {
    struct Canonical: Decodable {
        let startedAt: Int64
        let changeAtFractionOfWeek: Double
        let seed: Int64
    }

    struct Input: Decodable {
        struct Master: Decodable {
            let name: String
            let style: String
            let heatCraft: Int
            let aromaCraft: Int
            let performanceCraft: Int
            let weeklyWage: Double
            let equipment: [String]
        }
        struct Schedule: Decodable {
            let openDays: Int
            let opensAt: Double
            let closesAt: Double
        }
        let cash: Double
        let built: [String]
        let masterHired: Bool
        let master: Master
        let admissionPrice: Double
        let schedule: Schedule
    }

    struct Command: Decodable {
        let type: String
        let value: Double
    }

    struct Expected: Decodable {
        let settledBlocksBeforeCommand: Int
        let accruedAdmissionsBeforeCommand: Int
        let finalWeek: Int
        let finalAdmissions: Int
        let finalSpecialSeats: Int
        let finalAdmissionRevenue: Double
        let finalSpecialRevenue: Double
        let finalRevenue: Double
        let finalOperatingCosts: Double
        let finalNetResult: Double
        let finalCash: Double
        let runtimeClearedAtBoundary: Bool
    }

    let fixtureVersion: Int
    let name: String
    let canonical: Canonical
    let input: Input
    let command: Command
    let expected: Expected
}

final class MidweekFixtureParityTests: XCTestCase {
    private func fixtureURL() -> URL {
        var url = URL(fileURLWithPath: #filePath)
        for _ in 0..<5 { url.deleteLastPathComponent() }
        return url.appendingPathComponent("src/sim/fixtures/canal-midweek-reprice-v1.json")
    }

    private func loadFixture() throws -> MidweekFixture {
        try JSONDecoder().decode(MidweekFixture.self, from: Data(contentsOf: fixtureURL()))
    }

    func testSwiftMidweekRepricingMatchesSharedTypeScriptFixture() throws {
        let fixture = try loadFixture()
        let master = fixture.input.master
        let schedule = fixture.input.schedule
        var input = CanalOperatingInput(
            cash: fixture.input.cash,
            built: Set(fixture.input.built),
            master: fixture.input.masterHired ? MasterProfile(
                name: master.name,
                style: master.style,
                heatCraft: master.heatCraft,
                aromaCraft: master.aromaCraft,
                performanceCraft: master.performanceCraft,
                weeklyWage: master.weeklyWage,
                equipment: master.equipment
            ) : nil,
            admissionPrice: fixture.input.admissionPrice,
            schedule: VenueSchedule(
                openDays: schedule.openDays,
                opensAt: schedule.opensAt,
                closesAt: schedule.closesAt
            )
        )

        let startedAt = fixture.canonical.startedAt
        let changeAt = startedAt + Int64(
            Double(CanonicalTime.realMillisecondsPerGameWeek) * fixture.canonical.changeAtFractionOfWeek
        )
        let initialBlocks = CanalBlockPlanner.plan(input)
        var runtime = OperatingWeekRuntime(week: 1, plannedBlocks: initialBlocks)

        for block in initialBlocks where CanalRuntimeReplan.blockSettlesAt(
            startedAt: startedAt,
            week: runtime.week,
            block: block
        ) <= changeAt {
            runtime = OperatingRuntime.settle(block, into: runtime)
        }

        XCTAssertEqual(runtime.settledBlockKeys.count, fixture.expected.settledBlocksBeforeCommand)
        XCTAssertEqual(runtime.accruedAdmissions, fixture.expected.accruedAdmissionsBeforeCommand)
        XCTAssertEqual(fixture.command.type, "setAdmissionPrice")

        input.admissionPrice = fixture.command.value
        runtime = CanalRuntimeReplan.replanFuture(
            input: input,
            runtime: runtime,
            startedAt: startedAt,
            at: changeAt
        )

        for block in runtime.plannedBlocks where !runtime.settledBlockKeys.contains(block.key) {
            runtime = OperatingRuntime.settle(block, into: runtime)
        }

        let period = CanalPeriodCosts.calculate(built: input.built)
        let revenue = runtime.accruedRevenue.admissions
            + runtime.accruedRevenue.specialGus
            + runtime.accruedRevenue.shop
        let variableCosts = runtime.accruedCosts.venueBase
            + runtime.accruedCosts.staff
            + runtime.accruedCosts.utilitiesAndCleaning
            + runtime.accruedCosts.programMaterials
            + runtime.accruedCosts.shopProcurement
            + runtime.accruedCosts.facilities
        let operatingCosts = variableCosts + period.total
        let netResult = revenue - operatingCosts - input.loanRepayment
        let finalCash = input.cash + netResult

        XCTAssertEqual(fixture.expected.finalWeek, 2)
        XCTAssertEqual(runtime.accruedAdmissions, fixture.expected.finalAdmissions)
        XCTAssertEqual(runtime.accruedSpecialSeats, fixture.expected.finalSpecialSeats)
        XCTAssertEqual(runtime.accruedRevenue.admissions, fixture.expected.finalAdmissionRevenue)
        XCTAssertEqual(runtime.accruedRevenue.specialGus, fixture.expected.finalSpecialRevenue)
        XCTAssertEqual(revenue, fixture.expected.finalRevenue)
        XCTAssertEqual(operatingCosts, fixture.expected.finalOperatingCosts)
        XCTAssertEqual(netResult, fixture.expected.finalNetResult)
        XCTAssertEqual(finalCash, fixture.expected.finalCash)
        XCTAssertTrue(fixture.expected.runtimeClearedAtBoundary)
    }
}
