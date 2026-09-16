import Foundation

public struct CanalBuildSpec: Equatable, Sendable {
    public let moduleID: String
    public let price: Double
    public let buildHours: Double

    public init(moduleID: String, price: Double, buildHours: Double) {
        self.moduleID = moduleID
        self.price = price
        self.buildHours = buildHours
    }
}

public enum CanalConstructionCommandError: Error, Equatable {
    case unknownModule
    case alreadyBuilt
    case projectAlreadyActive
    case insufficientCash
    case noMatchingProject
}

public enum CanalConstructionCommands {
    /// Current Canal data-card values. These stay in one pure catalogue until shared JSON content
    /// becomes the source for both the game app and Content Studio.
    public static let buildSpecs: [CanalBuildSpec] = [
        .init(moduleID: "arrival", price: 1_200, buildHours: 1),
        .init(moduleID: "shop", price: 4_000, buildHours: 3),
        .init(moduleID: "program", price: 32_000, buildHours: 8),
        .init(moduleID: "aufguss-yard", price: 16_000, buildHours: 6),
        .init(moduleID: "shower", price: 3_000, buildHours: 2),
        .init(moduleID: "cold-plunge", price: 9_500, buildHours: 5),
        .init(moduleID: "bench-refit", price: 2_500, buildHours: 2),
    ]

    public static func start(
        _ envelope: CanalCanonicalEnvelope,
        moduleID: String
    ) throws -> CanalCanonicalEnvelope {
        guard let spec = buildSpecs.first(where: { $0.moduleID == moduleID }) else {
            throw CanalConstructionCommandError.unknownModule
        }
        guard !envelope.world.world.built.contains(moduleID) else {
            throw CanalConstructionCommandError.alreadyBuilt
        }
        // All current Canal modules are functional/mechanical projects. Purely cosmetic future
        // changes may bypass this slot, but a second major project cannot start at this venue.
        guard envelope.world.world.construction.isEmpty else {
            throw CanalConstructionCommandError.projectAlreadyActive
        }
        guard envelope.world.world.cash >= spec.price else {
            throw CanalConstructionCommandError.insufficientCash
        }

        return CanalCanonicalRuntime.applyWorldChange(envelope) { world in
            var next = world
            next.cash -= spec.price
            let duration = Int64((spec.buildHours * 60 * 60 * 1_000).rounded())
            next.construction = [
                CanalConstructionProject(
                    moduleID: moduleID,
                    completesAt: envelope.lastSimulatedAt + duration
                )
            ]
            return next
        }
    }

    /// Current compact-slice rush rule uses 25% of build price and completes the active project
    /// immediately at the already-advanced canonical command time. It is money-only: no contractor
    /// entity or secondary staffing mechanic is created.
    public static func rush(
        _ envelope: CanalCanonicalEnvelope,
        moduleID: String
    ) throws -> CanalCanonicalEnvelope {
        guard let spec = buildSpecs.first(where: { $0.moduleID == moduleID }) else {
            throw CanalConstructionCommandError.unknownModule
        }
        guard envelope.world.world.construction.contains(where: { $0.moduleID == moduleID }) else {
            throw CanalConstructionCommandError.noMatchingProject
        }
        let rushCost = ceil(spec.price * 0.25)
        guard envelope.world.world.cash >= rushCost else {
            throw CanalConstructionCommandError.insufficientCash
        }

        return CanalCanonicalRuntime.applyWorldChange(envelope) { world in
            var next = world
            next.cash -= rushCost
            next.built.insert(moduleID)
            next.construction.removeAll { $0.moduleID == moduleID }
            return next
        }
    }
}
