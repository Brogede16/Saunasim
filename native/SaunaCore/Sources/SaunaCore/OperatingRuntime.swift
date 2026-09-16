import Foundation

public struct RevenueBreakdown: Codable, Equatable, Sendable {
    public var admissions: Double
    public var specialGus: Double
    public var shop: Double

    public init(admissions: Double = 0, specialGus: Double = 0, shop: Double = 0) {
        self.admissions = admissions
        self.specialGus = specialGus
        self.shop = shop
    }
}

public struct CostBreakdown: Codable, Equatable, Sendable {
    public var venueBase: Double
    public var staff: Double
    public var utilitiesAndCleaning: Double
    public var programMaterials: Double
    public var shopProcurement: Double
    public var facilities: Double

    public init(
        venueBase: Double = 0,
        staff: Double = 0,
        utilitiesAndCleaning: Double = 0,
        programMaterials: Double = 0,
        shopProcurement: Double = 0,
        facilities: Double = 0
    ) {
        self.venueBase = venueBase
        self.staff = staff
        self.utilitiesAndCleaning = utilitiesAndCleaning
        self.programMaterials = programMaterials
        self.shopProcurement = shopProcurement
        self.facilities = facilities
    }
}

public struct ShopLine: Codable, Equatable, Sendable {
    public var itemID: String
    public var name: String
    public var units: Int
    public var revenue: Double
    public var procurement: Double

    public init(itemID: String, name: String, units: Int, revenue: Double, procurement: Double) {
        self.itemID = itemID
        self.name = name
        self.units = units
        self.revenue = revenue
        self.procurement = procurement
    }
}

public struct OperatingBlock: Codable, Equatable, Sendable {
    public var dayIndex: Int
    public var daypart: String
    public var startsAt: Double
    public var endsAt: Double
    public var openHours: Double
    public var scheduledAufguss: Int
    public var specialCapacity: Int
    public var demandWeight: Double
    public var admissionPrice: Double
    public var supplementPrice: Double
    public var sessionMaterialCost: Double
    public var staffCost: Double
    public var admissions: Int
    public var specialSeats: Int
    public var specialProgrammeDemand: Int
    public var specialWalkUpSeats: Int
    public var specialTurnedAway: Int
    public var programSignature: String
    public var shopSales: Int
    public var shopLines: [ShopLine]
    public var recoveryDemand: Int
    public var recoveryQueueLoss: Int
    public var recoveryBottleneck: String?
    public var revenue: RevenueBreakdown
    public var costs: CostBreakdown
    public var operatingNet: Double
    public var wear: [String: Double]

    public init(
        dayIndex: Int,
        daypart: String,
        startsAt: Double,
        endsAt: Double,
        openHours: Double,
        scheduledAufguss: Int,
        specialCapacity: Int,
        demandWeight: Double,
        admissionPrice: Double,
        supplementPrice: Double,
        sessionMaterialCost: Double,
        staffCost: Double,
        admissions: Int,
        specialSeats: Int,
        specialProgrammeDemand: Int = 0,
        specialWalkUpSeats: Int = 0,
        specialTurnedAway: Int = 0,
        programSignature: String = "",
        shopSales: Int = 0,
        shopLines: [ShopLine] = [],
        recoveryDemand: Int = 0,
        recoveryQueueLoss: Int = 0,
        recoveryBottleneck: String? = nil,
        revenue: RevenueBreakdown,
        costs: CostBreakdown,
        operatingNet: Double,
        wear: [String: Double] = [:]
    ) {
        self.dayIndex = dayIndex
        self.daypart = daypart
        self.startsAt = startsAt
        self.endsAt = endsAt
        self.openHours = openHours
        self.scheduledAufguss = scheduledAufguss
        self.specialCapacity = specialCapacity
        self.demandWeight = demandWeight
        self.admissionPrice = admissionPrice
        self.supplementPrice = supplementPrice
        self.sessionMaterialCost = sessionMaterialCost
        self.staffCost = staffCost
        self.admissions = admissions
        self.specialSeats = specialSeats
        self.specialProgrammeDemand = specialProgrammeDemand
        self.specialWalkUpSeats = specialWalkUpSeats
        self.specialTurnedAway = specialTurnedAway
        self.programSignature = programSignature
        self.shopSales = shopSales
        self.shopLines = shopLines
        self.recoveryDemand = recoveryDemand
        self.recoveryQueueLoss = recoveryQueueLoss
        self.recoveryBottleneck = recoveryBottleneck
        self.revenue = revenue
        self.costs = costs
        self.operatingNet = operatingNet
        self.wear = wear
    }

    public var key: String {
        "\(dayIndex):\(OperatingRuntime.number(startsAt)):\(OperatingRuntime.number(endsAt))"
    }
}

public struct OperatingWeekRuntime: Codable, Equatable, Sendable {
    public var week: Int
    public var plannedBlocks: [OperatingBlock]
    public var settledBlockKeys: [String]
    public var accruedAdmissions: Int
    public var accruedSpecialSeats: Int
    public var accruedSpecialCapacity: Int
    public var accruedSpecialProgrammeDemand: Int
    public var accruedSpecialWalkUpSeats: Int
    public var accruedSpecialTurnedAway: Int
    public var accruedShopSales: Int
    public var accruedRecoveryDemand: Int
    public var accruedRecoveryQueueLoss: Int
    public var accruedRevenue: RevenueBreakdown
    public var accruedCosts: CostBreakdown
    public var accruedOperatingNet: Double

    public init(week: Int, plannedBlocks: [OperatingBlock]) {
        self.week = week
        self.plannedBlocks = plannedBlocks
        self.settledBlockKeys = []
        self.accruedAdmissions = 0
        self.accruedSpecialSeats = 0
        self.accruedSpecialCapacity = 0
        self.accruedSpecialProgrammeDemand = 0
        self.accruedSpecialWalkUpSeats = 0
        self.accruedSpecialTurnedAway = 0
        self.accruedShopSales = 0
        self.accruedRecoveryDemand = 0
        self.accruedRecoveryQueueLoss = 0
        self.accruedRevenue = RevenueBreakdown()
        self.accruedCosts = CostBreakdown()
        self.accruedOperatingNet = 0
    }
}

public enum OperatingRuntime {
    public static func settle(_ block: OperatingBlock, into runtime: OperatingWeekRuntime) -> OperatingWeekRuntime {
        guard !runtime.settledBlockKeys.contains(block.key) else { return runtime }
        var next = runtime
        next.settledBlockKeys.append(block.key)
        next.accruedAdmissions += block.admissions
        next.accruedSpecialSeats += block.specialSeats
        next.accruedSpecialCapacity += block.specialCapacity
        next.accruedSpecialProgrammeDemand += block.specialProgrammeDemand
        next.accruedSpecialWalkUpSeats += block.specialWalkUpSeats
        next.accruedSpecialTurnedAway += block.specialTurnedAway
        next.accruedShopSales += block.shopSales
        next.accruedRecoveryDemand += block.recoveryDemand
        next.accruedRecoveryQueueLoss += block.recoveryQueueLoss
        next.accruedRevenue.admissions = money(next.accruedRevenue.admissions + block.revenue.admissions)
        next.accruedRevenue.specialGus = money(next.accruedRevenue.specialGus + block.revenue.specialGus)
        next.accruedRevenue.shop = money(next.accruedRevenue.shop + block.revenue.shop)
        next.accruedCosts.venueBase = money(next.accruedCosts.venueBase + block.costs.venueBase)
        next.accruedCosts.staff = money(next.accruedCosts.staff + block.costs.staff)
        next.accruedCosts.utilitiesAndCleaning = money(next.accruedCosts.utilitiesAndCleaning + block.costs.utilitiesAndCleaning)
        next.accruedCosts.programMaterials = money(next.accruedCosts.programMaterials + block.costs.programMaterials)
        next.accruedCosts.shopProcurement = money(next.accruedCosts.shopProcurement + block.costs.shopProcurement)
        next.accruedCosts.facilities = money(next.accruedCosts.facilities + block.costs.facilities)
        next.accruedOperatingNet = money(next.accruedOperatingNet + block.operatingNet)
        return next
    }

    static func number(_ value: Double) -> String {
        if value.rounded() == value { return String(Int(value)) }
        return String(value)
    }

    private static func money(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
