import XCTest
@testable import SaunaCore

final class CanonicalTimeTests: XCTestCase {
    func testOneRealDayIsExactlyOneGameWeek() {
        XCTAssertEqual(CanonicalTime.realMillisecondsPerGameWeek, 86_400_000)
        XCTAssertEqual(CanonicalTime.gameDaysPerWeek, 7)
    }

    func testWeekStartAdvancesByOneRealDay() {
        let startedAt: Int64 = 1_000_000
        XCTAssertEqual(
            CanonicalTime.weekStart(startedAt: startedAt, gameWeek: 2),
            startedAt + CanonicalTime.realMillisecondsPerGameWeek
        )
    }

    func testBlockTimestampUsesCanonicalWeekScale() {
        let startedAt: Int64 = 1_000_000
        let endOfWeek = CanonicalTime.timestamp(
            startedAt: startedAt,
            gameWeek: 1,
            dayIndex: 6,
            gameHour: 24
        )
        XCTAssertEqual(endOfWeek, startedAt + CanonicalTime.realMillisecondsPerGameWeek)
    }
}
