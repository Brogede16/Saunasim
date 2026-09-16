import Foundation

public enum CanalBlockPlanner {
    private struct Daypart { let id: String; let from: Double; let to: Double }
    private static let dayparts = [
        Daypart(id: "night", from: 0, to: 7), Daypart(id: "morning", from: 7, to: 11),
        Daypart(id: "day", from: 11, to: 17), Daypart(id: "evening", from: 17, to: 24),
    ]
    private static let classicReferenceWeight = 1.035

    public static func plan(_ input: CanalOperatingInput) -> [OperatingBlock] {
        let schedule = CanalOperatingCore.effectiveSchedule(input)
        let sessions = CanalOperatingCore.scheduleAufguss(input: input, effectiveSchedule: schedule)
        let seatCapacity = sessionSeatCapacity(input)
        let openDays = max(0, min(7, schedule.openDays))
        var skeleton: [(dayIndex: Int, daypart: String, startsAt: Double, endsAt: Double, openHours: Double, scheduled: Int, weight: Double)] = []
        for dayIndex in 0..<openDays {
            for part in dayparts {
                let openHours = overlap(schedule.opensAt, schedule.closesAt, part.from, part.to)
                if openHours <= 0 { continue }
                let startsAt = max(schedule.opensAt, part.from), endsAt = min(schedule.closesAt, part.to)
                let scheduled = sessions.filter { $0.dayIndex == dayIndex && $0.startsAt >= startsAt && $0.startsAt < endsAt }.count
                skeleton.append((dayIndex, part.id, startsAt, endsAt, openHours, scheduled, openHours * daypartWeight(input.program.intent, part.id)))
            }
        }

        let openHours = skeleton.reduce(0.0) { $0 + $1.openHours }
        let rawPotential = skeleton.reduce(0.0) {
            $0 + (ordinaryBasePerFifty(input) / 50) * $1.openHours * (daypartWeight(input.program.intent, $1.daypart) / classicReferenceWeight)
        }
        let potential = max(0, jsRound(rawPotential))
        let capacity = max(0, jsRound((82.0 / 50.0) * openHours))
        let acceptedAdmissions = min(capacity, max(0, jsRound(max(0, Double(potential) - priceResistance(input)))))
        let admissions = allocateIntegers(total: acceptedAdmissions, weights: skeleton.map { $0.openHours * daypartWeight(input.program.intent, $0.daypart) })
        let staffCosts = allocateMoney(total: totalStaffWage(input: input, sessions: sessions), weights: skeleton.map { $0.openHours + Double($0.scheduled) })

        let fit = physicalProgramFit(input)
        let basePerSession = max(0, 7 + (input.program.intent == .socialEnergy ? 2.5 : input.program.intent == .showJourney ? 2 : 0) - max(0, input.program.supplementPrice - 7) * 2 * fit.priceSensitivity)
        let programmeDemand = input.master == nil || sessions.isEmpty ? 0 : max(0, jsRound(Double(sessions.count) * fit.multiplier * basePerSession * scheduleProgramTiming(schedule, intent: input.program.intent)))
        let totalSpecialCapacity = sessions.count * seatCapacity
        let hasCapacityUpgrade = input.built.contains("bench-refit") || input.built.contains("program") || input.built.contains("aufguss-yard")
        let spare = hasCapacityUpgrade ? max(0, min(acceptedAdmissions, totalSpecialCapacity) - programmeDemand) : 0
        let potentialWalkUp = jsRound(Double(spare) * 0.25)
        let acceptedSpecial = min(acceptedAdmissions, totalSpecialCapacity, programmeDemand + potentialWalkUp)
        let walkUpSeats = max(0, acceptedSpecial - min(programmeDemand, acceptedSpecial))
        let turnedAway = max(0, programmeDemand - min(acceptedAdmissions, totalSpecialCapacity))
        let sessionWeights = skeleton.map { $0.scheduled > 0 ? Double($0.scheduled) * max(0.25, daypartWeight(input.program.intent, $0.daypart)) : 0 }
        let specialSeats = allocateIntegers(total: acceptedSpecial, weights: sessionWeights)
        let demandByBlock = allocateIntegers(total: programmeDemand, weights: sessionWeights)
        let walkUpsByBlock = allocateIntegers(total: walkUpSeats, weights: sessionWeights)
        let turnedAwayByBlock = allocateIntegers(total: turnedAway, weights: sessionWeights)

        return skeleton.enumerated().map { index, item in
            let blockAdmissions = admissions[index], blockSpecial = specialSeats[index]
            let shop = CanalBlockChannels.shop(input: input, admissions: blockAdmissions)
            let recovery = CanalBlockChannels.recovery(input: input, scheduledAufguss: item.scheduled, specialSeats: blockSpecial)
            let wear = CanalBlockChannels.wear(input: input, specialSeats: blockSpecial, recoveryDemand: recovery.recoveryDemand)
            let revenue = RevenueBreakdown(
                admissions: money(Double(blockAdmissions) * input.admissionPrice),
                specialGus: money(Double(blockSpecial) * input.program.supplementPrice),
                shop: money(shop.revenue)
            )
            let costs = CostBreakdown(
                venueBase: money(item.openHours * 2),
                staff: money(staffCosts[index]),
                utilitiesAndCleaning: money(item.openHours * 2),
                programMaterials: money(Double(item.scheduled) * input.program.materialCostPerSession),
                shopProcurement: money(shop.procurement),
                facilities: 0
            )
            let totalRevenue = revenue.admissions + revenue.specialGus + revenue.shop
            let totalCosts = costs.venueBase + costs.staff + costs.utilitiesAndCleaning + costs.programMaterials + costs.shopProcurement
            return OperatingBlock(
                dayIndex: item.dayIndex, daypart: item.daypart, startsAt: item.startsAt, endsAt: item.endsAt,
                openHours: item.openHours, scheduledAufguss: item.scheduled, specialCapacity: item.scheduled * seatCapacity,
                demandWeight: item.weight, admissionPrice: input.admissionPrice, supplementPrice: input.program.supplementPrice,
                sessionMaterialCost: input.program.materialCostPerSession, staffCost: money(staffCosts[index]), admissions: blockAdmissions,
                specialSeats: blockSpecial, specialProgrammeDemand: demandByBlock[index], specialWalkUpSeats: walkUpsByBlock[index],
                specialTurnedAway: turnedAwayByBlock[index], programSignature: programSignature(input.program), shopSales: shop.sales,
                shopLines: shop.lines, recoveryDemand: recovery.recoveryDemand, recoveryQueueLoss: recovery.queueLoss,
                recoveryBottleneck: recovery.bottleneck, revenue: revenue, costs: costs,
                operatingNet: money(totalRevenue - totalCosts), wear: wear
            )
        }
    }

    public static func programSignature(_ program: ActiveProgram) -> String {
        "\(program.intent.rawValue)|\(program.roomMinutes)|\(program.materialCostPerSession)|\(program.recoveryFinish.rawValue)"
    }

    private static func sessionSeatCapacity(_ input: CanalOperatingInput) -> Int {
        if input.built.contains("program") {
            return max(1, Int(floor(24 * CanalBlockChannels.conditionMultiplier(input.condition["program"] ?? 100))))
        }
        if input.built.contains("aufguss-yard") { return 20 }
        return 8 + (input.built.contains("bench-refit") ? 3 : 0)
    }

    private static func physicalProgramFit(_ input: CanalOperatingInput) -> (multiplier: Double, priceSensitivity: Double) {
        if input.program.intent == .quietRecovery && (input.built.contains("shower") || input.built.contains("cold-plunge")) { return (1.1, 0.85) }
        if input.program.intent == .socialEnergy && input.built.contains("aufguss-yard") { return (1.15, 0.85) }
        if input.program.intent == .showJourney && (input.built.contains("program") || input.built.contains("aufguss-yard")) { return (1.15, 0.8) }
        if input.program.intent == .classicRitual && input.built.contains("program") { return (1.08, 0.9) }
        return (1, 1)
    }

    private static func scheduleProgramTiming(_ schedule: VenueSchedule, intent: ProgramIntent) -> Double {
        let dayHours = overlap(schedule.opensAt, schedule.closesAt, 9, 17)
        let eveningHours = overlap(schedule.opensAt, schedule.closesAt, 17, 23)
        switch intent {
        case .quietRecovery: return dayHours >= 4 ? 1.08 : eveningHours >= 4 ? 0.9 : 0.82
        case .socialEnergy, .showJourney: return eveningHours >= 4 ? 1.1 : eveningHours >= 2 && dayHours >= 4 ? 1 : dayHours >= 4 ? 0.88 : 0.8
        case .classicRitual: return 1
        }
    }

    private static func ordinaryBasePerFifty(_ input: CanalOperatingInput) -> Double {
        if input.master == nil { return 30 + (input.built.contains("arrival") ? 3 : 0) }
        return 70 + (input.built.contains("arrival") ? 5 : 0) + (input.built.contains("cold-plunge") ? 6 : 0) + (input.built.contains("aufguss-yard") ? 8 : 0) + (input.built.contains("program") ? 8 : 0)
    }
    private static func credibleAdmissionPrice(_ input: CanalOperatingInput) -> Double {
        24 + (input.built.contains("aufguss-yard") ? 2 : 0) + (input.built.contains("shower") ? 1 : 0) + (input.built.contains("cold-plunge") ? 1 : 0) + (input.serviceHostCount > 0 ? 1 : 0)
    }
    private static func priceResistance(_ input: CanalOperatingInput) -> Double {
        let delta = input.admissionPrice - credibleAdmissionPrice(input)
        return delta < 0 ? delta * 4 : delta * 2 + max(0, delta - 6) * 2
    }
    private static func totalStaffWage(input: CanalOperatingInput, sessions: [ScheduledAufguss]) -> Double {
        let masterWage: Double
        if let master = input.master {
            let paidHours = sessions.reduce(0.0) { $0 + ($1.endsAt - $1.startsAt) }
            masterWage = Double(jsRound(paidHours * (master.weeklyWage / 50)))
        } else { masterWage = 0 }
        let required = CanalOperatingCore.weeklyOpenHours(input.schedule)
        let remainingAfterOwner = max(0, required - CanalOperatingCore.ownerFreeHostHoursPerGameWeek)
        let hired = max(0, min(3, input.serviceHostCount))
        var hoursLeft = min(remainingAfterOwner, Double(hired) * 50)
        let tierWages = [210.0, 260.0, 330.0]
        var hostWage = 0.0
        for wage in tierWages.prefix(hired) where hoursLeft > 0 {
            let assigned = min(50, hoursLeft)
            hostWage += wage / 50 * assigned
            hoursLeft -= assigned
        }
        return Double(jsRound(hostWage)) + masterWage
    }
    private static func daypartWeight(_ intent: ProgramIntent, _ daypart: String) -> Double {
        switch intent {
        case .quietRecovery: return daypart == "morning" ? 1.2 : daypart == "day" ? 1.15 : daypart == "evening" ? 0.85 : 0.45
        case .socialEnergy, .showJourney: return daypart == "evening" ? 1.25 : daypart == "day" ? 0.95 : daypart == "morning" ? 0.7 : 0.5
        case .classicRitual: return daypart == "evening" ? 1.05 : daypart == "day" ? 1.05 : daypart == "morning" ? 0.9 : 0.55
        }
    }
    private static func allocateIntegers(total: Int, weights: [Double]) -> [Int] {
        guard !weights.isEmpty, total > 0 else { return weights.map { _ in 0 } }
        let clamped = weights.map { max(0, $0) }, sum = clamped.reduce(0, +)
        guard sum > 0 else { return weights.enumerated().map { $0.offset == 0 ? total : 0 } }
        let raw = clamped.map { Double(total) * $0 / sum }
        var result = raw.map { Int(floor($0)) }, remaining = total - raw.map { Int(floor($0)) }.reduce(0, +)
        let order = raw.enumerated().sorted {
            let lf = $0.element - floor($0.element), rf = $1.element - floor($1.element)
            return lf != rf ? lf > rf : $0.offset < $1.offset
        }
        for entry in order where remaining > 0 { result[entry.offset] += 1; remaining -= 1 }
        return result
    }
    private static func allocateMoney(total: Double, weights: [Double]) -> [Double] {
        guard !weights.isEmpty else { return [] }; if total == 0 { return weights.map { _ in 0 } }
        let clamped = weights.map { max(0, $0) }, sum = clamped.reduce(0, +)
        guard sum > 0 else { return weights.enumerated().map { $0.offset == 0 ? total : 0 } }
        var result = clamped.map { money(total * $0 / sum) }
        let residual = money(total - result.reduce(0, +)); result[result.count - 1] = money(result[result.count - 1] + residual)
        return result
    }
    private static func overlap(_ from: Double, _ to: Double, _ windowFrom: Double, _ windowTo: Double) -> Double { max(0, min(to, windowTo) - max(from, windowFrom)) }
    private static func jsRound(_ value: Double) -> Int { Int(floor(value + 0.5)) }
    private static func money(_ value: Double) -> Double { (value * 100).rounded() / 100 }
}
