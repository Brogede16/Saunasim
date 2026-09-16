import Foundation
import XCTest
@testable import SaunaCore

private struct MidweekProgramFixture: Decodable {
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
        let value: String
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

final class MidweekProgramFixtureParityTests: XCTestCase {
    private func fixtureURL() -> URL {
        var url = URL(fileURLWithPath: #filePath)
        for _ in 0..<5 { url.deleteLastPathComponent() }
        return url.appendingPathComponent("src/sim/fixtures/canal-midweek-program-v1.json")
    }

    func testNativeEnvelopeMatchesSharedProgramChangeFixture() throws {
        let fixture = try JSONDecoder().decode(
            MidweekProgramFixture.self,
            from: Data(contentsOf: fixtureURL())
        )
        let master = fixture.input.master
        let schedule = fixture.input.schedule
        let world = CanalWorldState(
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
        let start = fixture.canonical.startedAt
        let changeAt = start + Int64(
            Double(CanonicalTime.realMillisecondsPerGameWeek) * fixture.canonical.changeAtFractionOfWeek
        )
        let boundary = start + CanonicalTime.realMillisecondsPerGameWeek
        let initial = CanalCanonicalRuntime.createEnvelope(
            world: world,
            startedAt: start,
            seed: fixture.canonical.seed
        )
        let partial = try CanalCanonicalRuntime.advance(initial, to: changeAt).envelope

        XCTAssertEqual(
            partial.world.operatingRuntime?.settledBlockKeys.count,
            fixture.expected.settledBlocksBeforeCommand
        )
        XCTAssertEqual(
            partial.world.operatingRuntime?.accruedAdmissions,
            fixture.expected.accruedAdmissionsBeforeCommand
        )
        XCTAssertEqual(fixture.command.type, "setProgramIntent")
        XCTAssertEqual(fixture.command.value, ProgramIntent.socialEnergy.rawValue)

        let changed = CanalCanonicalRuntime.setProgramIntent(partial, value: .socialEnergy)
        XCTAssertEqual(
            changed.world.operatingRuntime?.settledBlockKeys,
            partial.world.operatingRuntime?.settledBlockKeys
        )
        XCTAssertEqual(
            changed.world.operatingRuntime?.accruedAdmissions,
            partial.world.operatingRuntime?.accruedAdmissions
        )

        let resumed = try CanalCanonicalRuntime.decode(CanalCanonicalRuntime.encode(changed))
        let completed = try CanalCanonicalRuntime.advance(resumed, to: boundary).envelope
        let report = try XCTUnwrap(completed.world.world.lastReport)

        XCTAssertEqual(completed.world.world.week, fixture.expected.finalWeek)
        XCTAssertEqual(report.admissions, fixture.expected.finalAdmissions)
        XCTAssertEqual(report.specialSeats, fixture.expected.finalSpecialSeats)
        XCTAssertEqual(report.revenue, fixture.expected.finalRevenue)
        XCTAssertEqual(report.operatingCosts, fixture.expected.finalOperatingCosts)
        XCTAssertEqual(report.netResult, fixture.expected.finalNetResult)
        XCTAssertEqual(completed.world.world.cash, fixture.expected.finalCash)
        XCTAssertEqual(
            completed.world.operatingRuntime == nil,
            fixture.expected.runtimeClearedAtBoundary
        )

        // The report currently stores total revenue rather than its line-item breakdown, so verify
        // the fixture's admission/special split from immutable settled blocks as an additional parity guard.
        let initialRevenue = partial.world.operatingRuntime?.accruedRevenue ?? RevenueBreakdown()
        let futureBlocks = changed.world.operatingRuntime?.plannedBlocks.filter {
            !(changed.world.operatingRuntime?.settledBlockKeys.contains($0.key) ?? false)
        } ?? []
        let finalAdmissionRevenue = initialRevenue.admissions + futureBlocks.reduce(0) { $0 + $1.revenue.admissions }
        let finalSpecialRevenue = initialRevenue.specialGus + futureBlocks.reduce(0) { $0 + $1.revenue.specialGus }
        XCTAssertEqual(finalAdmissionRevenue, fixture.expected.finalAdmissionRevenue)
        XCTAssertEqual(finalSpecialRevenue, fixture.expected.finalSpecialRevenue)
    }
}
