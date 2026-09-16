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
    private static let variableVenueCostPerOpenHour = 2.0
    private static let variableUtilitiesAndCleaningPerOpenHour = 2.0
    private static let classicReferenceWeight = 1.035

    public static func simulateStarterWeek(_ input: CanalOperatingInput) -> CanalWeekResult {
        let effective = effectiveSchedule(input)
        let openHours = weeklyOpenHours(effective)
        let sessions = scheduleAufguss(input: input, effectiveSchedule: effective)
        let staffCost = masterWage(master: input.master, sessions: sessions)
        let admissions = ordinaryAdmissions(input: input, effectiveSchedule: effective)
        let specialSeats = specialAdmissions(input: input, sessions: sessions, totalAdmissions: admissions)

        let admissionRevenue = Double(admissions) * input.admissionPrice
        let specialRevenue = Double(specialSeats) * input.program.supplementPrice
        let revenue = money(admissionRevenue + specialRevenue)

        let variableVenue = openHours * variableVenueCostPerOpenHour
        let variableUtilities = openHours * variableUtilitiesAndCleaningPerOpenHour
        let materials = Double(sessions.count) * input.program.materialCostPerSession
        let facilities = facilityPeriodCosts(input.built)
        let operatingCosts = money(
            fixedVenueBase
                + fixedUtilitiesAndCleaning
                + variableVenue
                + variableUtilities
                + staffCost
                + materials
                + facilities
        )
        let netResult = money(revenue - operatingCosts - input.loanRepayment)

        return CanalWeekResult(
            week: 2,
            cash: money(input.cash + netResult),
            admissions: admissions,
            specialSeats: specialSeats,
            shopSales: 0,
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

    private static func ordinaryAdmissions(input: CanalOperatingInput, effectiveSchedule: VenueSchedule) -> Int {
        let openHours = weeklyOpenHours(effectiveSchedule)
        guard openHours > 0 else { return 0 }

        let hasMaster = input.master != nil
        let hasSign = input.built.contains("arrival")
        let hasPlunge = input.built.contains("cold-plunge")
        let hasYard = input.built.contains("aufguss-yard")
        let hasProgramSauna = input.built.contains("program")
        let basePerFifty: Double
        if !hasMaster {
            basePerFifty = 30 + (hasSign ? 3 : 0)
        } else {
            basePerFifty = 70
                + (hasSign ? 5 : 0)
                + (hasPlunge ? 6 : 0)
                + (hasYard ? 8 : 0)
                + (hasProgramSauna ? 8 : 0)
        }

        let scheduleWeight = scheduleDemandWeight(effectiveSchedule, intent: input.program.intent)
        let rawPotential = (basePerFifty / 50) * openHours * (scheduleWeight / classicReferenceWeight)
        let roundedPotential = max(0, jsRound(rawPotential))
        let totalCapacity = max(0, jsRound((82.0 / 50.0) * openHours))
        let crediblePrice = 24.0
            + (hasYard ? 2 : 0)
            + (input.built.contains("shower") ? 1 : 0)
            + (hasPlunge ? 1 : 0)
            + (input.serviceHostCount > 0 ? 1 : 0)
        let delta = input.admissionPrice - crediblePrice
        let resistance = delta < 0 ? delta * 4 : delta * 2 + max(0, delta - 6) * 2
        let priceAdjusted = max(0, Double(roundedPotential) - resistance)
        return min(totalCapacity, max(0, jsRound(priceAdjusted)))
    }

    private static func specialAdmissions(
        input: CanalOperatingInput,
        sessions: [ScheduledAufguss],
        totalAdmissions: Int
    ) -> Int {
        guard input.master != nil, !sessions.isEmpty else { return 0 }
        let scheduled = sessions.count
        let basePerSession = max(0, 7.0 - max(0, input.program.supplementPrice - 7) * 2)
        let programmeDemand = max(0, jsRound(Double(scheduled) * basePerSession))
        let capacity = scheduled * compactRoomCapacity
        return min(totalAdmissions, capacity, programmeDemand)
    }

    private static func masterWage(master: MasterProfile?, sessions: [ScheduledAufguss]) -> Double {
        guard let master, !sessions.isEmpty else { return 0 }
        let paidHours = sessions.reduce(0.0) { $0 + ($1.endsAt - $1.startsAt) }
        let hourly = master.weeklyWage / masterReferenceWeeklyHours
        return Double(jsRound(paidHours * hourly))
    }

    private static func facilityPeriodCosts(_ built: Set<String>) -> Double {
        var total = 0.0
        if built.contains("shower") { total += 20 }
        if built.contains("cold-plunge") { total += 75 }
        if built.contains("aufguss-yard") { total += 190 }
        if built.contains("program") { total += 290 }
        return total
    }

    private static func scheduleDemandWeight(_ schedule: VenueSchedule, intent: ProgramIntent) -> Double {
        let parts: [(Double, Double, Double)] = [
            (0, 7, daypartWeight(intent, "night")),
            (7, 11, daypartWeight(intent, "morning")),
            (11, 17, daypartWeight(intent, "day")),
            (17, 24, daypartWeight(intent, "evening")),
        ]
        let dailyWeighted = parts.reduce(0.0) { sum, part in
            let hours = max(0, min(schedule.closesAt, part.1) - max(schedule.opensAt, part.0))
            return sum + hours * part.2
        }
        let dailyHours = max(0, schedule.closesAt - schedule.opensAt)
        return dailyHours == 0 ? 0 : dailyWeighted / dailyHours
    }

    private static func daypartWeight(_ intent: ProgramIntent, _ daypart: String) -> Double {
        switch intent {
        case .quietRecovery:
            return daypart == "morning" ? 1.2 : daypart == "day" ? 1.15 : daypart == "evening" ? 0.85 : 0.45
        case .socialEnergy, .showJourney:
            return daypart == "evening" ? 1.25 : daypart == "day" ? 0.95 : daypart == "morning" ? 0.7 : 0.5
        case .classicRitual:
            return daypart == "evening" ? 1.05 : daypart == "day" ? 1.05 : daypart == "morning" ? 0.9 : 0.55
        }
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

    private static func jsRound(_ value: Double) -> Int {
        Int(floor(value + 0.5))
    }

    private static func money(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
