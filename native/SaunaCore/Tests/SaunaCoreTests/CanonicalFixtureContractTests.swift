import Foundation
import XCTest
@testable import SaunaCore

private struct CanonicalFixture: Decodable {
    struct Canonical: Decodable {
        let startedAt: Int64
        let advanceTo: Int64
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

    struct Expected: Decodable {
        let week: Int
        let cash: Double
        let admissions: Int
        let specialSeats: Int
        let shopSales: Int
        let revenue: Double
        let operatingCosts: Double
        let loanRepayment: Double
        let netResult: Double
        let feasibleSessions: Int
        let staffCost: Double
        let runtimeClearedAtBoundary: Bool
    }

    let fixtureVersion: Int
    let name: String
    let canonical: Canonical
    let input: Input
    let expected: Expected
}

final class CanonicalFixtureContractTests: XCTestCase {
    private func fixtureURL() -> URL {
        var url = URL(fileURLWithPath: #filePath)
        for _ in 0..<5 {
            url.deleteLastPathComponent()
        }
        return url.appendingPathComponent("src/sim/fixtures/canal-canonical-week-v2.json")
    }

    private func loadFixture() throws -> CanonicalFixture {
        let data = try Data(contentsOf: fixtureURL())
        return try JSONDecoder().decode(CanonicalFixture.self, from: data)
    }

    func testSwiftReadsTheSharedTypeScriptParityFixture() throws {
        let fixture = try loadFixture()

        XCTAssertEqual(fixture.fixtureVersion, 2)
        XCTAssertEqual(fixture.name, "canal-canonical-starter-master-default-week")
        XCTAssertEqual(
            fixture.canonical.advanceTo - fixture.canonical.startedAt,
            CanonicalTime.realMillisecondsPerGameWeek
        )
        XCTAssertEqual(
            DeterministicRNG.createState(seed: fixture.canonical.seed).seed,
            UInt32(fixture.canonical.seed)
        )
    }

    func testSwiftStarterOperatingLoopMatchesTypeScriptFixture() throws {
        let fixture = try loadFixture()
        let master = fixture.input.master
        let schedule = fixture.input.schedule
        let input = CanalOperatingInput(
            cash: fixture.input.cash,
            built: Set(fixture.input.built),
            master: fixture.input.masterHired
                ? MasterProfile(
                    name: master.name,
                    style: master.style,
                    heatCraft: master.heatCraft,
                    aromaCraft: master.aromaCraft,
                    performanceCraft: master.performanceCraft,
                    weeklyWage: master.weeklyWage,
                    equipment: master.equipment
                )
                : nil,
            admissionPrice: fixture.input.admissionPrice,
            schedule: VenueSchedule(
                openDays: schedule.openDays,
                opensAt: schedule.opensAt,
                closesAt: schedule.closesAt
            )
        )

        let result = CanalOperatingCore.simulateStarterWeek(input)

        XCTAssertEqual(result.week, fixture.expected.week)
        XCTAssertEqual(result.cash, fixture.expected.cash)
        XCTAssertEqual(result.admissions, fixture.expected.admissions)
        XCTAssertEqual(result.specialSeats, fixture.expected.specialSeats)
        XCTAssertEqual(result.shopSales, fixture.expected.shopSales)
        XCTAssertEqual(result.revenue, fixture.expected.revenue)
        XCTAssertEqual(result.operatingCosts, fixture.expected.operatingCosts)
        XCTAssertEqual(result.loanRepayment, fixture.expected.loanRepayment)
        XCTAssertEqual(result.netResult, fixture.expected.netResult)
        XCTAssertEqual(result.feasibleSessions, fixture.expected.feasibleSessions)
        XCTAssertEqual(result.staffCost, fixture.expected.staffCost)
        XCTAssertEqual(result.scheduledSessions.count, 2)
        XCTAssertTrue(fixture.expected.runtimeClearedAtBoundary)
    }
}
