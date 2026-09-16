import Foundation

public struct VenueSchedule: Codable, Equatable, Sendable {
    public var openDays: Int
    public var opensAt: Double
    public var closesAt: Double

    public init(openDays: Int, opensAt: Double, closesAt: Double) {
        self.openDays = openDays
        self.opensAt = opensAt
        self.closesAt = closesAt
    }
}

public struct MasterProfile: Codable, Equatable, Sendable {
    public var name: String
    public var style: String
    public var heatCraft: Int
    public var aromaCraft: Int
    public var performanceCraft: Int
    public var weeklyWage: Double
    public var equipment: [String]

    public init(
        name: String,
        style: String,
        heatCraft: Int,
        aromaCraft: Int,
        performanceCraft: Int,
        weeklyWage: Double,
        equipment: [String]
    ) {
        self.name = name
        self.style = style
        self.heatCraft = heatCraft
        self.aromaCraft = aromaCraft
        self.performanceCraft = performanceCraft
        self.weeklyWage = weeklyWage
        self.equipment = equipment
    }
}

public enum ProgramIntent: String, Codable, Sendable {
    case classicRitual = "Classic Ritual"
    case quietRecovery = "Quiet Recovery"
    case socialEnergy = "Social Energy"
    case showJourney = "Show Journey"
}

public struct ActiveProgram: Codable, Equatable, Sendable {
    public var name: String
    public var intent: ProgramIntent
    public var requestedSessions: Int
    public var supplementPrice: Double
    public var roomMinutes: Double
    public var materialCostPerSession: Double

    public init(
        name: String,
        intent: ProgramIntent,
        requestedSessions: Int,
        supplementPrice: Double,
        roomMinutes: Double,
        materialCostPerSession: Double
    ) {
        self.name = name
        self.intent = intent
        self.requestedSessions = requestedSessions
        self.supplementPrice = supplementPrice
        self.roomMinutes = roomMinutes
        self.materialCostPerSession = materialCostPerSession
    }

    public static let starter = ActiveProgram(
        name: "Canal Ritual",
        intent: .classicRitual,
        requestedSessions: 2,
        supplementPrice: 7,
        roomMinutes: 14,
        materialCostPerSession: 4
    )
}

public struct CanalOperatingInput: Equatable, Sendable {
    public var cash: Double
    public var built: Set<String>
    public var master: MasterProfile?
    public var admissionPrice: Double
    public var schedule: VenueSchedule
    public var program: ActiveProgram
    public var serviceHostCount: Int
    public var loanRepayment: Double

    public init(
        cash: Double,
        built: Set<String>,
        master: MasterProfile?,
        admissionPrice: Double,
        schedule: VenueSchedule,
        program: ActiveProgram = .starter,
        serviceHostCount: Int = 0,
        loanRepayment: Double = 0
    ) {
        self.cash = cash
        self.built = built
        self.master = master
        self.admissionPrice = admissionPrice
        self.schedule = schedule
        self.program = program
        self.serviceHostCount = serviceHostCount
        self.loanRepayment = loanRepayment
    }
}

public struct ScheduledAufguss: Equatable, Sendable {
    public let dayIndex: Int
    public let startsAt: Double
    public let endsAt: Double
}

public struct CanalWeekResult: Equatable, Sendable {
    public let week: Int
    public let cash: Double
    public let admissions: Int
    public let specialSeats: Int
    public let shopSales: Int
    public let revenue: Double
    public let operatingCosts: Double
    public let loanRepayment: Double
    public let netResult: Double
    public let feasibleSessions: Int
    public let staffCost: Double
    public let scheduledSessions: [ScheduledAufguss]
}

public enum CanalOperatingCore {
    public static let ownerFreeHostHoursPerGameWeek = 50.0
    public static let masterReferenceWeeklyHours = 50.0
    public static let compactRoomCapacity = 8

    private static let fixedVenueBase = 300.0
    private static let fixedUtilitiesAndCleaning = 212.0

    public static func simulateStarterWeek(_ input: CanalOperatingInput) -> CanalWeekResult {
        let blocks = CanalBlockPlanner.plan(input)
        let sessions = scheduleAufguss(input: input, effectiveSchedule: effectiveSchedule(input))
        let admissions = blocks.reduce(0) { $0 + $1.admissions }
        let specialSeats = blocks.reduce(0) { $0 + $1.specialSeats }
        let shopSales = blocks.reduce(0) { $0 + $1.shopSales }
        let revenue = money(blocks.reduce(0.0) {
            $0 + $1.revenue.admissions + $1.revenue.specialGus + $1.revenue.shop
        })
        let variableCosts = blocks.reduce(0.0) {
            $0
                + $1.costs.venueBase
                + $1.costs.staff
                + $1.costs.utilitiesAndCleaning
                + $1.costs.programMaterials
                + $1.costs.shopProcurement
                + $1.costs.facilities
        }
        let staffCost = money(blocks.reduce(0.0) { $0 + $1.costs.staff })
        let operatingCosts = money(
            variableCosts
                + fixedVenueBase
                + fixedUtilitiesAndCleaning
                + facilityPeriodCosts(input.built)
        )
        let netResult = money(revenue - operatingCosts - input.loanRepayment)

        return CanalWeekResult(
            week: 2,
            cash: money(input.cash + netResult),
            admissions: admissions,
            specialSeats: specialSeats,
            shopSales: shopSales,
            revenue: revenue,
            operatingCosts: operatingCosts,
            loanRepayment: input.loanRepayment,
            netResult: netResult,
            feasibleSessions: sessions.count,
            staffCost: staffCost,
            scheduledSessions: sessions
        )
    }

    public static func weeklyOpenHours(_ schedule: VenueSchedule) -> Double {
        let daily = max(0, min(24, schedule.closesAt - schedule.opensAt))
        return Double(max(0, min(7, schedule.openDays))) * daily
    }

    public static func effectiveSchedule(_ input: CanalOperatingInput) -> VenueSchedule {
        let required = weeklyOpenHours(input.schedule)
        let owner = min(required, ownerFreeHostHoursPerGameWeek)
        let remaining = max(0, required - owner)
        let paidAvailable = Double(max(0, input.serviceHostCount)) * 50
        let uncovered = max(0, remaining - paidAvailable)
        let coverage = required == 0 ? 1 : (required - uncovered) / required
        let requestedDaily = max(0, input.schedule.closesAt - input.schedule.opensAt)
        return VenueSchedule(
            openDays: input.schedule.openDays,
            opensAt: input.schedule.opensAt,
            closesAt: input.schedule.opensAt + requestedDaily * coverage
        )
    }

    public static func scheduleAufguss(
        input: CanalOperatingInput,
        effectiveSchedule: VenueSchedule
    ) -> [ScheduledAufguss] {
        guard input.master != nil, input.program.requestedSessions > 0 else { return [] }
        let openDays = max(0, min(7, effectiveSchedule.openDays))
        let duration = input.program.roomMinutes / 60
        let preferred = preferredHours(input.program.intent)
        var candidates: [ScheduledAufguss] = []

        for day in 0..<openDays {
            for preferredStart in preferred {
                let start = max(effectiveSchedule.opensAt, preferredStart)
                let end = start + duration
                if start >= effectiveSchedule.opensAt && end <= effectiveSchedule.closesAt {
                    candidates.append(ScheduledAufguss(dayIndex: day, startsAt: start, endsAt: end))
                }
            }
        }

        var scheduled: [ScheduledAufguss] = []
        var usedDays: [Int: Int] = [:]
        while scheduled.count < input.program.requestedSessions {
            let feasible = candidates
                .filter { candidate in !scheduled.contains(where: { overlaps($0, candidate) }) }
                .sorted { a, b in
                    let ac = usedDays[a.dayIndex, default: 0]
                    let bc = usedDays[b.dayIndex, default: 0]
                    if ac != bc { return ac < bc }
                    if a.dayIndex != b.dayIndex { return a.dayIndex < b.dayIndex }
                    return preferredIndex(a.startsAt, in: preferred) < preferredIndex(b.startsAt, in: preferred)
                }
            guard let next = feasible.first else { break }
            scheduled.append(next)
            usedDays[next.dayIndex, default: 0] += 1
            if let index = candidates.firstIndex(of: next) {
                candidates.remove(at: index)
            }
        }
        return scheduled
    }

    private static func facilityPeriodCosts(_ built: Set<String>) -> Double {
        var total = 0.0
        if built.contains("shower") { total += 20 }
        if built.contains("cold-plunge") { total += 75 }
        if built.contains("aufguss-yard") { total += 190 }
        if built.contains("program") { total += 290 }
        return total
    }

    private static func preferredHours(_ intent: ProgramIntent) -> [Double] {
        switch intent {
        case .quietRecovery:
            return [11, 14, 16, 18, 20]
        case .socialEnergy, .showJourney:
            return [19, 18, 20, 17, 16, 14]
        case .classicRitual:
            return [17, 14, 19, 12, 20, 10]
        }
    }

    private static func preferredIndex(_ hour: Double, in preferred: [Double]) -> Int {
        preferred.firstIndex(of: hour) ?? Int.max
    }

    private static func overlaps(_ a: ScheduledAufguss, _ b: ScheduledAufguss) -> Bool {
        a.dayIndex == b.dayIndex && a.startsAt < b.endsAt && b.startsAt < a.endsAt
    }

    private static func money(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
