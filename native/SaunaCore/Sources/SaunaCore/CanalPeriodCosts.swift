import Foundation

public struct CanalPeriodCostSummary: Equatable, Sendable {
    public let venueBase: Double
    public let utilitiesAndCleaning: Double
    public let facilities: Double

    public var total: Double { venueBase + utilitiesAndCleaning + facilities }
}

public enum CanalPeriodCosts {
    public static func calculate(built: Set<String>) -> CanalPeriodCostSummary {
        var facilities = 0.0
        if built.contains("shower") { facilities += 20 }
        if built.contains("cold-plunge") { facilities += 75 }
        if built.contains("aufguss-yard") { facilities += 190 }
        if built.contains("program") { facilities += 290 }
        return CanalPeriodCostSummary(
            venueBase: 300,
            utilitiesAndCleaning: 212,
            facilities: facilities
        )
    }
}
