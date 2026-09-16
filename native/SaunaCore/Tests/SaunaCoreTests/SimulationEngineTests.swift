import XCTest
@testable import SaunaCore

private struct CounterWorld: Codable, Equatable, Sendable {
    var intervals = 0
    var milestones = 0
    var weeks = 0
}

final class SimulationEngineTests: XCTestCase {
    func testMilestoneResolvesBeforeWeekBoundaryAtSameTimestamp() throws {
        let startedAt: Int64 = 1_000_000
        let boundary = startedAt + CanonicalTime.realMillisecondsPerGameWeek
        let input = SimulationEnvelope(
            startedAt: startedAt,
            lastSimulatedAt: startedAt,
            rng: DeterministicRNG.createState(seed: 7),
            world: CounterWorld()
        )
        let adapter = SimulationAdapter<CounterWorld>(
            nextMilestoneAt: { _, after, to, _ in
                boundary > after && boundary <= to ? boundary : nil
            },
            advanceInterval: { world, context in
                var next = world
                next.intervals += 1
                return SimulationStepResult(world: next, rng: context.rng)
            },
            resolveMilestonesAt: { world, at, rng, _ in
                var next = world
                next.milestones += 1
                return SimulationStepResult(
                    world: next,
                    rng: rng,
                    events: [SimulationEvent(at: at, type: "milestone")]
                )
            },
            resolveGameWeekBoundary: { world, at, rng, _ in
                var next = world
                next.weeks += 1
                return SimulationStepResult(
                    world: next,
                    rng: rng,
                    events: [SimulationEvent(at: at, type: "week")]
                )
            }
        )

        let result = try SimulationEngine.advance(input, to: boundary, adapter: adapter)

        XCTAssertEqual(result.envelope.world.intervals, 1)
        XCTAssertEqual(result.envelope.world.milestones, 1)
        XCTAssertEqual(result.envelope.world.weeks, 1)
        XCTAssertEqual(result.events.map(\.type), ["milestone", "week"])
        XCTAssertEqual(result.envelope.lastSimulatedAt, boundary)
    }

    func testOneJumpAndChunkedAdvanceReachSamePureWorld() throws {
        let startedAt: Int64 = 5_000_000
        let end = startedAt + CanonicalTime.realMillisecondsPerGameWeek
        let adapter = SimulationAdapter<CounterWorld>(
            advanceInterval: { world, context in
                var next = world
                next.intervals += Int(context.to - context.from)
                return SimulationStepResult(world: next, rng: context.rng)
            },
            resolveGameWeekBoundary: { world, _, rng, _ in
                var next = world
                next.weeks += 1
                return SimulationStepResult(world: next, rng: rng)
            }
        )
        let initial = SimulationEnvelope(
            startedAt: startedAt,
            lastSimulatedAt: startedAt,
            rng: DeterministicRNG.createState(seed: 99),
            world: CounterWorld()
        )

        let offline = try SimulationEngine.advance(initial, to: end, adapter: adapter).envelope
        var online = initial
        for quarter in 1...4 {
            online = try SimulationEngine.advance(
                online,
                to: startedAt + CanonicalTime.realMillisecondsPerGameWeek * Int64(quarter) / 4,
                adapter: adapter
            ).envelope
        }

        XCTAssertEqual(online, offline)
    }
}
