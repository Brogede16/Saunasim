import Foundation

public enum CanalLoanID: String, Codable, CaseIterable, Sendable {
    case small
    case standard
    case large
}

public struct CanalLoanOffer: Codable, Equatable, Sendable {
    public var id: CanalLoanID
    public var name: String
    public var amount: Double
    public var weeklyPayment: Double
    public var weeks: Int

    public init(id: CanalLoanID, name: String, amount: Double, weeklyPayment: Double, weeks: Int) {
        self.id = id
        self.name = name
        self.amount = amount
        self.weeklyPayment = weeklyPayment
        self.weeks = weeks
    }
}

public struct CanalLoan: Codable, Equatable, Sendable {
    public var id: CanalLoanID
    public var weeklyPayment: Double
    public var remainingWeeks: Int

    public init(id: CanalLoanID, weeklyPayment: Double, remainingWeeks: Int) {
        self.id = id
        self.weeklyPayment = weeklyPayment
        self.remainingWeeks = remainingWeeks
    }
}

public enum CanalFinance {
    public static let offers: [CanalLoanID: CanalLoanOffer] = [
        .small: CanalLoanOffer(id: .small, name: "Small Bridge Loan", amount: 7_500, weeklyPayment: 375, weeks: 22),
        .standard: CanalLoanOffer(id: .standard, name: "Standard Expansion Loan", amount: 20_000, weeklyPayment: 750, weeks: 30),
        .large: CanalLoanOffer(id: .large, name: "Large Secured Loan", amount: 60_000, weeklyPayment: 1_900, weeks: 36),
    ]

    // Current Canal data-card purchase values. This lives here only while the native content
    // catalogue is being ported; the formula stays stable when values move into shared content data.
    private static let modulePurchasePrice: [String: Double] = [
        "arrival": 1_200,
        "shop": 4_000,
        "program": 32_000,
        "aufguss-yard": 16_000,
        "shower": 3_000,
        "cold-plunge": 9_500,
        "bench-refit": 2_500,
    ]

    public static func outstandingDebt(_ loans: [CanalLoan]) -> Double {
        money(loans.reduce(0) { $0 + $1.weeklyPayment * Double($1.remainingWeeks) })
    }

    public static func borrowingLimit(built: Set<String>, profitableWeeks: Int) -> Double {
        let builtValue = built.reduce(0.0) { total, id in
            total + (modulePurchasePrice[id] ?? 0) * 0.25
        }
        return 23_000 + min(70_000, (builtValue + Double(profitableWeeks) * 1_600).rounded())
    }

    public static func borrowingRoom(built: Set<String>, profitableWeeks: Int, loans: [CanalLoan]) -> Double {
        max(0, money(borrowingLimit(built: built, profitableWeeks: profitableWeeks) - outstandingDebt(loans)))
    }

    public static func canTake(_ id: CanalLoanID, built: Set<String>, profitableWeeks: Int, loans: [CanalLoan]) -> Bool {
        guard let offer = offers[id] else { return false }
        let totalRepayment = offer.weeklyPayment * Double(offer.weeks)
        return totalRepayment <= borrowingRoom(built: built, profitableWeeks: profitableWeeks, loans: loans)
    }

    public static func take(_ id: CanalLoanID, world: CanalWorldState) -> CanalWorldState? {
        guard let offer = offers[id], canTake(id, built: world.built, profitableWeeks: world.profitableWeeks, loans: world.loans) else {
            return nil
        }
        var next = world
        next.cash = money(next.cash + offer.amount)
        next.loans.append(CanalLoan(id: id, weeklyPayment: offer.weeklyPayment, remainingWeeks: offer.weeks))
        next.financialDecisionPending = false
        return next
    }

    public static func scheduledRepayment(loans: [CanalLoan], legacyRepayment: Double) -> Double {
        if !loans.isEmpty {
            return money(loans.reduce(0) { $0 + $1.weeklyPayment })
        }
        return money(legacyRepayment)
    }

    public static func advanceLoansAfterSettlement(_ loans: [CanalLoan]) -> [CanalLoan] {
        loans.compactMap { loan in
            let remaining = loan.remainingWeeks - 1
            guard remaining > 0 else { return nil }
            return CanalLoan(id: loan.id, weeklyPayment: loan.weeklyPayment, remainingWeeks: remaining)
        }
    }

    private static func money(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
