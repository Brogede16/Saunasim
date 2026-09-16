import Foundation

public struct SimulationEvent: Codable, Equatable, Sendable {
    public var at: Int64
    public var type: String
    public var detail: String?

    public init(at: Int64, type: String, detail: String? = nil) {
        self.at = at
        self.type = type
        self.detail = detail
    }
}

public struct SimulationEnvelope<World: Codable & Equatable & Sendable>: Codable, Equatable, Sendable {
    public var startedAt: Int64
    public var lastSimulatedAt: Int64
    public var rng: RNGState
    public var world: World

    public init(startedAt: Int64, lastSimulatedAt: Int64, rng: RNGState, world: World) {
        self.startedAt = startedAt
        self.lastSimulatedAt = lastSimulatedAt
        self.rng = rng
        self.world = world
    }
}

public struct SimulationContext: Sendable {
    public let from: Int64
    public let to: Int64
    public let rng: RNGState
    public let startedAt: Int64
}

public struct SimulationStepResult<World: Codable & Equatable & Sendable>: Sendable {
    public var world: World
    public var rng: RNGState
    public var events: [SimulationEvent]

    public init(world: World, rng: RNGState, events: [SimulationEvent] = []) {
        self.world = world
        self.rng = rng
        self.events = events
    }
}

public struct SimulationAdapter<World: Codable & Equatable & Sendable>: Sendable {
    public var nextMilestoneAt: @Sendable (World, Int64, Int64, Int64) -> Int64?
    public var advanceInterval: @Sendable (World, SimulationContext) -> SimulationStepResult<World>
    public var resolveMilestonesAt: @Sendable (World, Int64, RNGState, Int64) -> SimulationStepResult<World>
    public var resolveGameWeekBoundary: @Sendable (World, Int64, RNGState, Int64) -> SimulationStepResult<World>

    public init(
        nextMilestoneAt: @escaping @Sendable (World, Int64, Int64, Int64) -> Int64? = { _, _, _, _ in nil },
        advanceInterval: @escaping @Sendable (World, SimulationContext) -> SimulationStepResult<World>,
        resolveMilestonesAt: @escaping @Sendable (World, Int64, RNGState, Int64) -> SimulationStepResult<World> = { world, _, rng, _ in
            SimulationStepResult(world: world, rng: rng)
        },
        resolveGameWeekBoundary: @escaping @Sendable (World, Int64, RNGState, Int64) -> SimulationStepResult<World> = { world, _, rng, _ in
            SimulationStepResult(world: world, rng: rng)
        }
    ) {
        self.nextMilestoneAt = nextMilestoneAt
        self.advanceInterval = advanceInterval
        self.resolveMilestonesAt = resolveMilestonesAt
        self.resolveGameWeekBoundary = resolveGameWeekBoundary
    }
}

public struct AdvanceSimulationResult<World: Codable & Equatable & Sendable>: Sendable {
    public var envelope: SimulationEnvelope<World>
    public var events: [SimulationEvent]
}

public enum SimulationEngineError: Error, Equatable {
    case invalidMilestone
}

public enum SimulationEngine {
    public static func advance<World: Codable & Equatable & Sendable>(
        _ input: SimulationEnvelope<World>,
        to: Int64,
        adapter: SimulationAdapter<World>
    ) throws -> AdvanceSimulationResult<World> {
        try CanonicalTime.assertInterval(from: input.lastSimulatedAt, to: to)
        if input.lastSimulatedAt == to {
            return AdvanceSimulationResult(envelope: input, events: [])
        }

        var cursor = input.lastSimulatedAt
        var world = input.world
        var rng = input.rng
        var events: [SimulationEvent] = []

        while cursor < to {
            let weekBoundary = CanonicalTime.nextGameWeekBoundary(origin: input.startedAt, after: cursor)
            let milestone = adapter.nextMilestoneAt(world, cursor, to, input.startedAt)
            if let milestone, (milestone <= cursor || milestone > to) {
                throw SimulationEngineError.invalidMilestone
            }

            let next = min(to, weekBoundary, milestone ?? Int64.max)
            if next > cursor {
                let advanced = adapter.advanceInterval(
                    world,
                    SimulationContext(from: cursor, to: next, rng: rng, startedAt: input.startedAt)
                )
                world = advanced.world
                rng = advanced.rng
                events.append(contentsOf: advanced.events)
                cursor = next
            }

            if let milestone, cursor == milestone {
                let resolved = adapter.resolveMilestonesAt(world, cursor, rng, input.startedAt)
                world = resolved.world
                rng = resolved.rng
                events.append(contentsOf: resolved.events)
            }

            if cursor == weekBoundary {
                let resolved = adapter.resolveGameWeekBoundary(world, cursor, rng, input.startedAt)
                world = resolved.world
                rng = resolved.rng
                events.append(contentsOf: resolved.events)
            }
        }

        return AdvanceSimulationResult(
            envelope: SimulationEnvelope(
                startedAt: input.startedAt,
                lastSimulatedAt: to,
                rng: rng,
                world: world
            ),
            events: events
        )
    }
}
