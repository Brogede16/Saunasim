import XCTest
@testable import SaunaCore

final class DeterministicRNGTests: XCTestCase {
    func testTypeScriptParitySequenceForSeed12345() {
        var state = DeterministicRNG.createState(seed: 12_345)
        let expectedStates: [UInt32] = [
            3_336_926_330,
            1_697_253_807,
            2_816_511_904,
            1_955_480_042,
            718_842_323,
        ]

        for expected in expectedStates {
            let next = DeterministicRNG.next(state)
            XCTAssertEqual(next.state.state, expected)
            state = next.state
        }
    }

    func testSameSeedReplaysSameStream() {
        var left = DeterministicRNG.createState(seed: 20_260_916)
        var right = DeterministicRNG.createState(seed: 20_260_916)

        for _ in 0..<20 {
            let a = DeterministicRNG.next(left)
            let b = DeterministicRNG.next(right)
            XCTAssertEqual(a.value, b.value)
            XCTAssertEqual(a.state, b.state)
            left = a.state
            right = b.state
        }
    }

    func testNamedForksAreStableAndDoNotConsumeParent() {
        let root = DeterministicRNG.createState(seed: 20_260_916)
        XCTAssertEqual(
            DeterministicRNG.fork(root, streamID: "guests"),
            DeterministicRNG.fork(root, streamID: "guests")
        )
        XCTAssertNotEqual(
            DeterministicRNG.fork(root, streamID: "guests"),
            DeterministicRNG.fork(root, streamID: "trends")
        )
        XCTAssertEqual(root, DeterministicRNG.createState(seed: 20_260_916))
    }

    func testBoundedIntegerMatchesDeterministicContract() {
        let first = DeterministicRNG.nextInt(
            DeterministicRNG.createState(seed: 42),
            minInclusive: 3,
            maxExclusive: 8
        )
        let second = DeterministicRNG.nextInt(
            DeterministicRNG.createState(seed: 42),
            minInclusive: 3,
            maxExclusive: 8
        )
        XCTAssertEqual(first.value, second.value)
        XCTAssertGreaterThanOrEqual(first.value, 3)
        XCTAssertLessThan(first.value, 8)
    }
}
