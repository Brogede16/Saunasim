import Foundation

public enum CanonicalTime {
    /// Exactly one real day equals one in-game week.
    public static let realMillisecondsPerGameWeek: Int64 = 86_400_000
    public static let gameDaysPerWeek: Int64 = 7
    public static let realMillisecondsPerGameDay = realMillisecondsPerGameWeek / gameDaysPerWeek

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
