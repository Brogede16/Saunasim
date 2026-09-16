import Foundation
import XCTest
@testable import SaunaCore

private struct CanonicalFixture: Decodable {
    struct Canonical: Decodable {
        let startedAt: Int64
        let advanceTo: Int64
        let seed: Int64
    }

    struct Expected: Decodable {
        let week: Int
        let cash: Int
        let admissions: Int
        let specialSeats: Int
        let shopSales: Int
        let revenue: Int
        let operatingCosts: Int
        let loanRepayment: Int
        let netResult: Int
        let feasibleSessions: Int
        let staffCost: Int
        let runtimeClearedAtBoundary: Bool
    }

    let fixtureVersion: Int
    let name: String
    let canonical: Canonical
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

    func testSwiftReadsTheSharedTypeScriptParityFixture() throws {
        let data = try Data(contentsOf: fixtureURL())
        let fixture = try JSONDecoder().decode(CanonicalFixture.self, from: data)

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

        // These values are the first native simulation parity target. They are intentionally
        // decoded here before the full Swift operating engine exists so later ports cannot silently
        // redefine the contract they are meant to reproduce.
        XCTAssertEqual(fixture.expected.week, 2)
        XCTAssertEqual(fixture.expected.cash, 4_403)
        XCTAssertEqual(fixture.expected.admissions, 70)
        XCTAssertEqual(fixture.expected.specialSeats, 14)
        XCTAssertEqual(fixture.expected.revenue, 1_778)
        XCTAssertEqual(fixture.expected.operatingCosts, 725)
        XCTAssertEqual(fixture.expected.netResult, 1_053)
        XCTAssertTrue(fixture.expected.runtimeClearedAtBoundary)
    }
}
