import Foundation
import XCTest
@testable import SaunaCore

private struct FinanceFixture: Decodable {
    struct Canonical: Decodable { let startedAt: Int64; let advanceTo: Int64; let seed: Int64 }
    struct Loan: Decodable { let id: String; let weeklyPayment: Double; let remainingWeeks: Int }
    struct Input: Decodable { let cash: Double; let loan: Loan }
    struct Expected: Decodable {
        let week: Int; let cash: Double; let loanRepayment: Double; let remainingWeeks: Int
        let netResult: Double; let profitableWeeks: Int; let financialDecisionPending: Bool
    }
    let name: String; let canonical: Canonical; let input: Input; let expected: Expected
}

private struct ConstructionCompletionFixture: Decodable {
    struct Canonical: Decodable { let startedAt: Int64; let seed: Int64; let completionAt: Int64 }
    struct Input: Decodable { let cash: Double; let moduleId: String }
    struct Expected: Decodable { let built: Bool; let constructionRemaining: Int; let eventType: String; let eventDetail: String }
    let name: String; let canonical: Canonical; let input: Input; let expected: Expected
}

private struct ConstructionRushFixture: Decodable {
    struct Canonical: Decodable { let startedAt: Int64; let seed: Int64 }
    struct Input: Decodable { let cash: Double; let moduleId: String; let projectCompletesAt: Int64 }
    struct Expected: Decodable { let rushCost: Double; let cash: Double; let built: Bool; let constructionRemaining: Int }
    let name: String; let canonical: Canonical; let input: Input; let expected: Expected
}

final class FinanceConstructionParityTests: XCTestCase {
    private func repoFixture(_ name: String) -> URL {
        var url = URL(fileURLWithPath: #filePath)
        for _ in 0..<5 { url.deleteLastPathComponent() }
        return url.appendingPathComponent("src/sim/fixtures/\(name)")
    }

    private func starterWorld(cash: Double) -> CanalWorldState {
        CanalWorldState(
            cash: cash,
            built: [],
            master: MasterProfile(name: "Starter Master", style: "Traditional", heatCraft: 3, aromaCraft: 3, performanceCraft: 2, weeklyWage: 500),
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20)
        )
    }

    func testSharedFinanceFixtures() throws {
        for file in ["canal-finance-small-loan-v1.json", "canal-finance-distress-v1.json"] {
            let fixture = try JSONDecoder().decode(FinanceFixture.self, from: Data(contentsOf: repoFixture(file)))
            var world = starterWorld(cash: fixture.input.cash)
            world.loans = [CanalLoan(
                id: try XCTUnwrap(CanalLoanID(rawValue: fixture.input.loan.id)),
                weeklyPayment: fixture.input.loan.weeklyPayment,
                remainingWeeks: fixture.input.loan.remainingWeeks
            )]
            let completed = try CanalCanonicalRuntime.advance(
                CanalCanonicalRuntime.createEnvelope(world: world, startedAt: fixture.canonical.startedAt, seed: fixture.canonical.seed),
                to: fixture.canonical.advanceTo
            ).envelope.world.world

            XCTAssertEqual(completed.week, fixture.expected.week, fixture.name)
            XCTAssertEqual(completed.cash, fixture.expected.cash, fixture.name)
            XCTAssertEqual(completed.lastReport?.loanRepayment, fixture.expected.loanRepayment, fixture.name)
            XCTAssertEqual(completed.lastReport?.netResult, fixture.expected.netResult, fixture.name)
            XCTAssertEqual(completed.loans.first?.remainingWeeks, fixture.expected.remainingWeeks, fixture.name)
            XCTAssertEqual(completed.profitableWeeks, fixture.expected.profitableWeeks, fixture.name)
            XCTAssertEqual(completed.financialDecisionPending, fixture.expected.financialDecisionPending, fixture.name)
        }
    }

    func testSharedConstructionCompletionFixture() throws {
        let fixture = try JSONDecoder().decode(
            ConstructionCompletionFixture.self,
            from: Data(contentsOf: repoFixture("canal-construction-completion-v1.json"))
        )
        var world = starterWorld(cash: fixture.input.cash)
        world.construction = [CanalConstructionProject(moduleID: fixture.input.moduleId, completesAt: fixture.canonical.completionAt)]
        let result = try CanalCanonicalRuntime.advance(
            CanalCanonicalRuntime.createEnvelope(world: world, startedAt: fixture.canonical.startedAt, seed: fixture.canonical.seed),
            to: fixture.canonical.completionAt
        )

        XCTAssertEqual(result.envelope.world.world.built.contains(fixture.input.moduleId), fixture.expected.built)
        XCTAssertEqual(result.envelope.world.world.construction.count, fixture.expected.constructionRemaining)
        XCTAssertTrue(result.events.contains { event in
            event.at == fixture.canonical.completionAt && event.type == fixture.expected.eventType && event.detail == fixture.expected.eventDetail
        })
    }

    func testSharedMoneyOnlyRushFixture() throws {
        let fixture = try JSONDecoder().decode(
            ConstructionRushFixture.self,
            from: Data(contentsOf: repoFixture("canal-construction-rush-v1.json"))
        )
        var world = starterWorld(cash: fixture.input.cash)
        world.construction = [CanalConstructionProject(moduleID: fixture.input.moduleId, completesAt: fixture.input.projectCompletesAt)]
        let envelope = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: fixture.canonical.startedAt, seed: fixture.canonical.seed)
        let rushed = try CanalConstructionCommands.rush(envelope, moduleID: fixture.input.moduleId)

        XCTAssertEqual(fixture.input.cash - rushed.world.world.cash, fixture.expected.rushCost)
        XCTAssertEqual(rushed.world.world.cash, fixture.expected.cash)
        XCTAssertEqual(rushed.world.world.built.contains(fixture.input.moduleId), fixture.expected.built)
        XCTAssertEqual(rushed.world.world.construction.count, fixture.expected.constructionRemaining)
    }
}
