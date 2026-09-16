import Foundation

public enum CanonicalTimeError: Error, Equatable {
    case backwards
}

public enum CanonicalTime {
    /// Exactly one real day equals one in-game week.
    public static let realMillisecondsPerGameWeek: Int64 = 86_400_000
    public static let gameDaysPerWeek: Int64 = 7
    public static let gameWeeksPerYear: Int64 = 52
    public static let realMillisecondsPerGameDay = realMillisecondsPerGameWeek / gameDaysPerWeek
    public static let realMillisecondsPerGameYear = realMillisecondsPerGameWeek * gameWeeksPerYear

    public static func assertInterval(from: Int64, to: Int64) throws {
        if to < from { throw CanonicalTimeError.backwards }
    }

    public static func elapsedGameWeeks(from: Int64, to: Int64) throws -> Double {
        try assertInterval(from: from, to: to)
        return Double(to - from) / Double(realMillisecondsPerGameWeek)
    }

    public static func elapsedGameDays(from: Int64, to: Int64) throws -> Double {
        try elapsedGameWeeks(from: from, to: to) * Double(gameDaysPerWeek)
    }

    public static func gameWeekIndex(origin: Int64, timestamp: Int64) -> Int64 {
        let delta = Double(timestamp - origin) / Double(realMillisecondsPerGameWeek)
        return Int64(floor(delta))
    }

    public static func nextGameWeekBoundary(origin: Int64, after: Int64) -> Int64 {
        let index = gameWeekIndex(origin: origin, timestamp: after)
        let boundary = origin + (index + 1) * realMillisecondsPerGameWeek
        return boundary <= after ? boundary + realMillisecondsPerGameWeek : boundary
    }

    public static func weekStart(startedAt: Int64, gameWeek: Int) -> Int64 {
        startedAt + Int64(gameWeek - 1) * realMillisecondsPerGameWeek
    }

    public static func timestamp(
        startedAt: Int64,
        gameWeek: Int,
        dayIndex: Int,
        gameHour: Double
    ) -> Int64 {
        let start = Double(weekStart(startedAt: startedAt, gameWeek: gameWeek))
        let gameHours = Double(dayIndex * 24) + gameHour
        let offset = (gameHours / (7.0 * 24.0)) * Double(realMillisecondsPerGameWeek)
        return Int64((start + offset).rounded())
    }
}
