import Foundation

public struct CanalShopOutcome: Equatable, Sendable {
    public var sales: Int
    public var revenue: Double
    public var procurement: Double
    public var lines: [ShopLine]
}

public struct CanalRecoveryOutcome: Equatable, Sendable {
    public var recoveryDemand: Int
    public var plungeSlots: Int
    public var showerSlots: Int
    public var queueLoss: Int
    public var bottleneck: String?
}

public enum CanalBlockChannels {
    private struct ShopItem {
        let id: String
        let name: String
        let retail: Double
        let procurement: Double
        let draw: Double
        let tags: [String]
        let requiresIdentity: Bool
    }

    private static let baseAudience: [String: Double] = [
        "routine": 0.26, "recovery": 0.24, "social": 0.18, "premium": 0.14, "curious": 0.18,
    ]
    private static let shopItems = [
        ShopItem(id: "cold-water", name: "Cold Water", retail: 6, procurement: 2, draw: 2, tags: ["routine", "recovery", "social"], requiresIdentity: false),
        ShopItem(id: "herbal-tea", name: "Herbal Tea", retail: 9, procurement: 3, draw: 1.1, tags: ["recovery", "routine"], requiresIdentity: false),
        ShopItem(id: "towel-rental", name: "Towel Rental", retail: 5, procurement: 1, draw: 1.3, tags: ["routine", "recovery"], requiresIdentity: false),
        ShopItem(id: "sauna-towel", name: "Sauna Towel", retail: 18, procurement: 8, draw: 1, tags: ["routine", "premium"], requiresIdentity: false),
        ShopItem(id: "house-blend", name: "House Blend Oil", retail: 22, procurement: 10, draw: 0.9, tags: ["premium", "curious"], requiresIdentity: false),
        ShopItem(id: "signature-towel", name: "Signature Towel", retail: 30, procurement: 16, draw: 0.65, tags: ["premium", "curious"], requiresIdentity: true),
        ShopItem(id: "fruit-snack", name: "Fruit & Nut Pack", retail: 8, procurement: 3, draw: 1.2, tags: ["social", "recovery"], requiresIdentity: false),
    ]

    public static func shop(input: CanalOperatingInput, admissions: Int) -> CanalShopOutcome {
        guard input.built.contains("shop"), admissions > 0 else {
            return CanalShopOutcome(sales: 0, revenue: 0, procurement: 0, lines: [])
        }
        var audience = baseAudience
        if input.program.intent == .quietRecovery { audience["recovery", default: 0] += 0.12 }
        if input.program.intent == .socialEnergy || input.program.intent == .showJourney { audience["social", default: 0] += 0.12 }
        let selected = shopItems.filter {
            input.shopRange.contains($0.id) && (!$0.requiresIdentity || input.hasBrandIdentity)
        }
        guard !selected.isEmpty else { return CanalShopOutcome(sales: 0, revenue: 0, procurement: 0, lines: []) }
        let assortmentFit = selected.reduce(0.0) { $0 + itemFit($1, audience: audience) } / Double(selected.count)
        let potentialSales = jsRound(Double(admissions) * serviceShopConversion(input.serviceHostCount))
        let sales = max(0, jsRound(Double(potentialSales) * (0.55 + assortmentFit * 1.5)))
        let lines = resolveShopLines(selected: selected, sales: sales, audience: audience)
        return CanalShopOutcome(
            sales: sales,
            revenue: lines.reduce(0) { $0 + $1.revenue },
            procurement: lines.reduce(0) { $0 + $1.procurement },
            lines: lines
        )
    }

    public static func recovery(input: CanalOperatingInput, scheduledAufguss: Int, specialSeats: Int) -> CanalRecoveryOutcome {
        let hasPlunge = available(input, "cold-plunge")
        let hasShower = available(input, "shower")
        let usesPlungeFinish = input.program.recoveryFinish == .coldPlunge && hasPlunge
        let demand: Int
        if usesPlungeFinish {
            demand = Int(ceil(Double(specialSeats) * 0.45))
        } else if hasPlunge {
            demand = Int(ceil(Double(specialSeats) * 0.2))
        } else {
            demand = 0
        }
        let plungeSlots = hasPlunge
            ? Int(floor(Double(scheduledAufguss * 2) * conditionMultiplier(input.condition["cold-plunge"] ?? 100)))
            : 0
        let showerSlots = hasShower
            ? Int(floor(Double(scheduledAufguss * 2) * conditionMultiplier(input.condition["shower"] ?? 100)))
            : 0
        let queueLoss = min(5, max(0, Int(ceil(Double(demand - plungeSlots - showerSlots) / 2))))
        return CanalRecoveryOutcome(
            recoveryDemand: demand,
            plungeSlots: plungeSlots,
            showerSlots: showerSlots,
            queueLoss: queueLoss,
            bottleneck: queueLoss > 0 ? "Cold recovery" : nil
        )
    }

    public static func wear(input: CanalOperatingInput, specialSeats: Int, recoveryDemand: Int) -> [String: Double] {
        var wear: [String: Double] = [:]
        if eligible(input, "program"), specialSeats > 0 {
            wear["program"] = roundWear(Double(specialSeats) / 5)
        }
        if eligible(input, "shower"), recoveryDemand > 0 {
            wear["shower"] = roundWear(Double(recoveryDemand))
        }
        if eligible(input, "cold-plunge"), recoveryDemand > 0 {
            wear["cold-plunge"] = roundWear(Double(recoveryDemand))
        }
        return wear
    }

    public static func conditionMultiplier(_ condition: Double) -> Double {
        if condition <= 0 { return 0 }
        if condition < 10 { return 0.5 }
        if condition < 40 { return 0.75 }
        if condition < 70 { return 0.95 }
        return 1
    }

    private static func available(_ input: CanalOperatingInput, _ id: String) -> Bool {
        input.built.contains(id) && input.repairModuleID != id && (input.condition[id] ?? 100) > 0
    }
    private static func eligible(_ input: CanalOperatingInput, _ id: String) -> Bool { available(input, id) }

    private static func serviceShopConversion(_ count: Int) -> Double {
        if count <= 0 { return 0.33 }
        let values = [0.41, 0.04, 0.03]
        return values.prefix(min(count, values.count)).reduce(0, +)
    }

    private static func itemFit(_ item: ShopItem, audience: [String: Double]) -> Double {
        item.tags.reduce(0.0) { $0 + audience[$1, default: 0] } / Double(item.tags.count)
    }

    private static func resolveShopLines(selected: [ShopItem], sales: Int, audience: [String: Double]) -> [ShopLine] {
        guard sales > 0 else { return [] }
        let totalDraw = selected.reduce(0.0) { $0 + $1.draw * itemFit($1, audience: audience) }
        var assigned = 0
        return selected.enumerated().map { index, item in
            let units: Int
            if index == selected.count - 1 {
                units = sales - assigned
            } else {
                units = jsRound(Double(sales) * item.draw * itemFit(item, audience: audience) / totalDraw)
            }
            assigned += units
            return ShopLine(
                itemID: item.id,
                name: item.name,
                units: units,
                revenue: Double(units) * item.retail,
                procurement: Double(units) * item.procurement
            )
        }
    }

    private static func roundWear(_ value: Double) -> Double {
        (max(0, value) * 10_000).rounded() / 10_000
    }
    private static func jsRound(_ value: Double) -> Int { Int(floor(value + 0.5)) }
}
