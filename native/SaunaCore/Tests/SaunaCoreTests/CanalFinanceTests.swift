import XCTest
@testable import SaunaCore

final class CanalFinanceTests: XCTestCase {
    private func starterWorld(cash: Double = 3_350, profitableWeeks: Int = 0, loans: [CanalLoan] = []) -> CanalWorldState {
        CanalWorldState(
            cash: cash,
            built: [],
            master: MasterProfile(name: "Starter Master", style: "Traditional", heatCraft: 3, aromaCraft: 3, performanceCraft: 2, weeklyWage: 500),
            admissionPrice: 24,
            schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20),
            loans: loans,
            profitableWeeks: profitableWeeks
        )
    }

    func testThreeCanonicalLoanBandsStayStable() throws {
        XCTAssertEqual(CanalFinance.offers[.small]?.amount, 7_500)
        XCTAssertEqual(CanalFinance.offers[.small]?.weeklyPayment, 375)
        XCTAssertEqual(CanalFinance.offers[.small]?.weeks, 22)
        XCTAssertEqual(CanalFinance.offers[.standard]?.amount, 20_000)
        XCTAssertEqual(CanalFinance.offers[.standard]?.weeklyPayment, 750)
        XCTAssertEqual(CanalFinance.offers[.standard]?.weeks, 30)
        XCTAssertEqual(CanalFinance.offers[.large]?.amount, 60_000)
        XCTAssertEqual(CanalFinance.offers[.large]?.weeklyPayment, 1_900)
        XCTAssertEqual(CanalFinance.offers[.large]?.weeks, 36)
    }

    func testFreshStarterCanTakeBridgeButNotLargeSecuredLoan() throws {
        let world = starterWorld()
        XCTAssertTrue(CanalFinance.canTake(.small, built: world.built, profitableWeeks: world.profitableWeeks, loans: world.loans))
        XCTAssertTrue(CanalFinance.canTake(.standard, built: world.built, profitableWeeks: world.profitableWeeks, loans: world.loans))
        XCTAssertFalse(CanalFinance.canTake(.large, built: world.built, profitableWeeks: world.profitableWeeks, loans: world.loans))
    }

    func testTakingLoanAddsCashDebtAndClearsDecisionPending() throws {
        var world = starterWorld(cash: -500)
        world.financialDecisionPending = true
        let envelope = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: 1_000_000, seed: 42)
        let financed = try XCTUnwrap(CanalCanonicalRuntime.takeLoan(envelope, id: .small))

        XCTAssertEqual(financed.world.world.cash, 7_000)
        XCTAssertEqual(financed.world.world.loans, [CanalLoan(id: .small, weeklyPayment: 375, remainingWeeks: 22)])
        XCTAssertFalse(financed.world.world.financialDecisionPending)
    }

    func testSettlementAutomaticallyPaysLoanAndAdvancesTerm() throws {
        let startedAt: Int64 = 1_000_000
        let loan = CanalLoan(id: .small, weeklyPayment: 375, remainingWeeks: 22)
        let world = starterWorld(loans: [loan])
        let envelope = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: startedAt, seed: 42)
        let completed = try CanalCanonicalRuntime.advance(envelope, to: startedAt + CanonicalTime.realMillisecondsPerGameWeek).envelope.world.world

        XCTAssertEqual(completed.lastReport?.loanRepayment, 375)
        XCTAssertEqual(completed.loans, [CanalLoan(id: .small, weeklyPayment: 375, remainingWeeks: 21)])
        XCTAssertEqual(completed.week, 2)
    }

    func testNegativeSettlementCreatesFactualFinancialDecisionState() throws {
        let startedAt: Int64 = 1_000_000
        let expensiveDebt = CanalLoan(id: .large, weeklyPayment: 1_900, remainingWeeks: 36)
        let world = starterWorld(cash: 0, loans: [expensiveDebt])
        let envelope = CanalCanonicalRuntime.createEnvelope(world: world, startedAt: startedAt, seed: 42)
        let completed = try CanalCanonicalRuntime.advance(envelope, to: startedAt + CanonicalTime.realMillisecondsPerGameWeek).envelope.world.world

        XCTAssertLessThan(completed.cash, 0)
        XCTAssertTrue(completed.financialDecisionPending)
        XCTAssertEqual(completed.loans.first?.remainingWeeks, 35)
    }

    func testProfitableStreakIncreasesOnlyOnPositiveSettlement() throws {
        let startedAt: Int64 = 1_000_000
        let profitable = starterWorld(profitableWeeks: 3)
        let good = try CanalCanonicalRuntime.advance(
            CanalCanonicalRuntime.createEnvelope(world: profitable, startedAt: startedAt, seed: 42),
            to: startedAt + CanonicalTime.realMillisecondsPerGameWeek
        ).envelope.world.world
        XCTAssertEqual(good.profitableWeeks, 4)

        let bad = starterWorld(cash: 0, profitableWeeks: 3, loans: [CanalLoan(id: .large, weeklyPayment: 1_900, remainingWeeks: 36)])
        let distressed = try CanalCanonicalRuntime.advance(
            CanalCanonicalRuntime.createEnvelope(world: bad, startedAt: startedAt, seed: 42),
            to: startedAt + CanonicalTime.realMillisecondsPerGameWeek
        ).envelope.world.world
        XCTAssertEqual(distressed.profitableWeeks, 0)
    }
}
