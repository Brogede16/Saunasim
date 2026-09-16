import Foundation

public enum CanalBlockPlanner {
    private struct Daypart {
        let id: String
        let from: Double
        let to: Double
    }

    private static let dayparts = [
        Daypart(id: "night", from: 0, to: 7),
        Daypart(id: "morning", from: 7, to: 11),
        Daypart(id: "day", from: 11, to: 17),
        Daypart(id: "evening", from: 17, to: 24),
    ]

    private static let classicReferenceWeight = 1.035

    public static func plan(_ input: CanalOperatingInput) -> [OperatingBlock] {
        let schedule = CanalOperatingCore.effectiveSchedule(input)
        let sessions = CanalOperatingCore.scheduleAufguss(input: input, effectiveSchedule: schedule)
        let sessionCapacity = CanalOperatingCore.compactRoomCapacity
        let openDays = max(0, min(7, schedule.openDays))
        var skeleton: [(dayIndex: Int, daypart: String, startsAt: Double, endsAt: Double, openHours: Double, scheduled: Int, weight: Double)] = []

        for dayIndex in 0..<openDays {
            for part in dayparts {
                let openHours = overlap(schedule.opensAt, schedule.closesAt, part.from, part.to)
                if openHours <= 0 { continue }
                let startsAt = max(schedule.opensAt, part.from)
                let endsAt = min(schedule.closesAt, part.to)
                let scheduled = sessions.filter {
                    $0.dayIndex == dayIndex && $0.startsAt >= startsAt && $0.startsAt < endsAt
                }.count
                skeleton.append((
                    dayIndex,
                    part.id,
                    startsAt,
                    endsAt,
                    openHours,
                    scheduled,
                    openHours * daypartWeight(input.program.intent, part.id)
                ))
            }
        }

        let openHours = skeleton.reduce(0.0) { $0 + $1.openHours }
        let basePerFifty = ordinaryBasePerFifty(input)
        let rawPotential = skeleton.reduce(0.0) {
            $0 + (basePerFifty / 50) * $1.openHours * (daypartWeight(input.program.intent, $1.daypart) / classicReferenceWeight)
        }
        let potential = max(0, jsRound(rawPotential))
        let capacity = max(0, jsRound((82.0 / 50.0) * openHours))
        let adjusted = max(0, Double(potential) - priceResistance(input))
        let acceptedAdmissions = min(capacity, max(0, jsRound(adjusted)))
        let admissions = allocateIntegers(
            total: acceptedAdmissions,
            weights: skeleton.map { $0.openHours * daypartWeight(input.program.intent, $0.daypart) }
        )

        let staffTotal = totalStaffWage(input: input, sessions: sessions)
        let staffCosts = allocateMoney(
            total: staffTotal,
            weights: skeleton.map { $0.openHours + Double($0.scheduled) }
        )

        let scheduledCount = sessions.count
        let programmeDemand = specialProgrammeDemand(input: input, scheduledSessions: scheduledCount)
        let specialCapacity = scheduledCount * sessionCapacity
        let acceptedSpecial = min(acceptedAdmissions, specialCapacity, programmeDemand)
        let specialSeats = allocateIntegers(
            total: acceptedSpecial,
            weights: skeleton.map {
                $0.scheduled > 0
                    ? Double($0.scheduled) * max(0.25, daypartWeight(input.program.intent, $0.daypart))
                    : 0
            }
        )
        let programmeDemandByBlock = allocateIntegers(
            total: programmeDemand,
            weights: skeleton.map {
                $0.scheduled > 0
                    ? Double($0.scheduled) * max(0.25, daypartWeight(input.program.intent, $0.daypart))
                    : 0
            }
        )

        return skeleton.enumerated().map { index, item in
            let blockAdmissions = admissions[index]
            let blockSpecial = specialSeats[index]
            let blockProgrammeDemand = programmeDemandByBlock[index]
            let admissionRevenue = Double(blockAdmissions) * input.admissionPrice
            let specialRevenue = Double(blockSpecial) * input.program.supplementPrice
            let staffCost = staffCosts[index]
            let variableVenue = item.openHours * 2
            let variableUtilities = item.openHours * 2
            let materials = Double(item.scheduled) * input.program.materialCostPerSession
            let revenue = RevenueBreakdown(
                admissions: money(admissionRevenue),
                specialGus: money(specialRevenue),
                shop: 0
            )
            let costs = CostBreakdown(
                venueBase: money(variableVenue),
                staff: money(staffCost),
                utilitiesAndCleaning: money(variableUtilities),
                programMaterials: money(materials),
                shopProcurement: 0,
                facilities: 0
            )
            let totalRevenue = revenue.admissions + revenue.specialGus + revenue.shop
            let totalCosts = costs.venueBase + costs.staff + costs.utilitiesAndCleaning + costs.programMaterials
            return OperatingBlock(
                dayIndex: item.dayIndex,
                daypart: item.daypart,
                startsAt: item.startsAt,
                endsAt: item.endsAt,
                openHours: item.openHours,
                scheduledAufguss: item.scheduled,
                specialCapacity: item.scheduled * sessionCapacity,
                demandWeight: item.weight,
                admissionPrice: input.admissionPrice,
                supplementPrice: input.program.supplementPrice,
                sessionMaterialCost: input.program.materialCostPerSession,
                staffCost: money(staffCost),
                admissions: blockAdmissions,
                specialSeats: blockSpecial,
                specialProgrammeDemand: blockProgrammeDemand,
                specialWalkUpSeats: 0,
                specialTurnedAway: max(0, blockProgrammeDemand - blockSpecial),
                programSignature: programSignature(input.program),
                revenue: revenue,
                costs: costs,
                operatingNet: money(totalRevenue - totalCosts)
            )
        }
    }

    public static func programSignature(_ program: ActiveProgram) -> String {
        "\(program.name)|\(program.intent.rawValue)|\(program.roomMinutes)|\(program.materialCostPerSession)"
    }

    private static func ordinaryBasePerFifty(_ input: CanalOperatingInput) -> Double {
        if input.master == nil { return 30 + (input.built.contains("arrival") ? 3 : 0) }
        return 70
            + (input.built.contains("arrival") ? 5 : 0)
            + (input.built.contains("cold-plunge") ? 6 : 0)
            + (input.built.contains("aufguss-yard") ? 8 : 0)
            + (input.built.contains("program") ? 8 : 0)
    }

    private static func credibleAdmissionPrice(_ input: CanalOperatingInput) -> Double {
        24
            + (input.built.contains("aufguss-yard") ? 2 : 0)
            + (input.built.contains("shower") ? 1 : 0)
            + (input.built.contains("cold-plunge") ? 1 : 0)
            + (input.serviceHostCount > 0 ? 1 : 0)
    }

    private static func priceResistance(_ input: CanalOperatingInput) -> Double {
        let delta = input.admissionPrice - credibleAdmissionPrice(input)
        return delta < 0 ? delta * 4 : delta * 2 + max(0, delta - 6) * 2
    }

    private static func specialProgrammeDemand(input: CanalOperatingInput, scheduledSessions: Int) -> Int {
        guard input.master != nil, scheduledSessions > 0 else { return 0 }
        let intentBonus = input.program.intent == .socialEnergy ? 2.5 : input.program.intent == .showJourney ? 2 : 0
        let base = max(0, 7 + intentBonus - max(0, input.program.supplementPrice - 7) * 2)
        return max(0, jsRound(Double(scheduledSessions) * base))
    }

    private static func totalStaffWage(input: CanalOperatingInput, sessions: [ScheduledAufguss]) -> Double {
        guard let master = input.master else { return 0 }
        let paidHours = sessions.reduce(0.0) { $0 + ($1.endsAt - $1.startsAt) }
        return Double(jsRound(paidHours * (master.weeklyWage / 50)))
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

    private static func allocateIntegers(total: Int, weights: [Double]) -> [Int] {
        guard !weights.isEmpty, total > 0 else { return weights.map { _ in 0 } }
        let clamped = weights.map { max(0, $0) }
        let sum = clamped.reduce(0, +)
        guard sum > 0 else {
            return weights.enumerated().map { $0.offset == 0 ? total : 0 }
        }
        let raw = clamped.map { Double(total) * $0 / sum }
        var result = raw.map { Int(floor($0)) }
        var remaining = total - result.reduce(0, +)
        let order = raw.enumerated().sorted {
            let lf = $0.element - floor($0.element)
            let rf = $1.element - floor($1.element)
            if lf != rf { return lf > rf }
            return $0.offset < $1.offset
        }
        for entry in order where remaining > 0 {
            result[entry.offset] += 1
            remaining -= 1
        }
        return result
    }

    private static func allocateMoney(total: Double, weights: [Double]) -> [Double] {
        guard !weights.isEmpty else { return [] }
        if total == 0 { return weights.map { _ in 0 } }
        let clamped = weights.map { max(0, $0) }
        let sum = clamped.reduce(0, +)
        guard sum > 0 else {
            return weights.enumerated().map { $0.offset == 0 ? total : 0 }
        }
        var result = clamped.map { money(total * $0 / sum) }
        let residual = money(total - result.reduce(0, +))
        result[result.count - 1] = money(result[result.count - 1] + residual)
        return result
    }

    private static func overlap(_ from: Double, _ to: Double, _ windowFrom: Double, _ windowTo: Double) -> Double {
        max(0, min(to, windowTo) - max(from, windowFrom))
    }

    private static func jsRound(_ value: Double) -> Int {
        Int(floor(value + 0.5))
    }

    private static func money(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
