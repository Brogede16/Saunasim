import Foundation

public struct RNGState: Codable, Equatable, Sendable {
    public let seed: UInt32
    public let state: UInt32

    public init(seed: UInt32, state: UInt32) {
        self.seed = seed
        self.state = state
    }
}

public enum DeterministicRNG {
    private static let zeroSeedFallback: UInt32 = 0x6d2b79f5

    public static func createState(seed: Int64) -> RNGState {
        let normalized = UInt32(truncatingIfNeeded: seed)
        let nonZero = normalized == 0 ? zeroSeedFallback : normalized
        return RNGState(seed: nonZero, state: nonZero)
    }

    public static func next(_ input: RNGState) -> (value: Double, state: RNGState) {
        var x = input.state
        x ^= x &<< 13
        x ^= x >> 17
        x ^= x &<< 5
        let nextState = x
        return (
            Double(nextState) / 4_294_967_296.0,
            RNGState(seed: input.seed, state: nextState)
        )
    }

    public static func nextInt(
        _ input: RNGState,
        minInclusive: Int,
        maxExclusive: Int
    ) -> (value: Int, state: RNGState) {
        precondition(maxExclusive > minInclusive, "nextInt requires maxExclusive > minInclusive")
        let result = next(input)
        let width = maxExclusive - minInclusive
        let value = minInclusive + Int((result.value * Double(width)).rounded(.down))
        return (value, result.state)
    }

    public static func fork(_ input: RNGState, streamID: String) -> RNGState {
        var hash = input.seed ^ 0x811c9dc5
        for scalar in streamID.utf16 {
            hash ^= UInt32(scalar)
            hash = hash &* 0x01000193
        }
        return createState(seed: Int64(hash))
    }
}
