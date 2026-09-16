import Foundation

public enum CanalRuntimeReplan {
    public static func blockSettlesAt(
        startedAt: Int64,
        week: Int,
        block: OperatingBlock
    ) -> Int64 {
        CanonicalTime.timestamp(
            startedAt: startedAt,
            gameWeek: week,
            dayIndex: block.dayIndex,
            gameHour: block.endsAt
        )
    }

    /// Rebuild only unsettled future blocks after the caller has already advanced canonical time
    /// to `at`. Settled keys and accrued accounting remain immutable history.
    public static func replanFuture(
        input: CanalOperatingInput,
        runtime: OperatingWeekRuntime,
        startedAt: Int64,
        at: Int64
    ) -> OperatingWeekRuntime {
        let settled = runtime.plannedBlocks.filter { runtime.settledBlockKeys.contains($0.key) }
        let fresh = CanalBlockPlanner.plan(input).filter {
            blockSettlesAt(startedAt: startedAt, week: runtime.week, block: $0) > at
                && !runtime.settledBlockKeys.contains($0.key)
        }
        var next = runtime
        next.plannedBlocks = (settled + fresh).sorted {
            blockSettlesAt(startedAt: startedAt, week: runtime.week, block: $0)
                < blockSettlesAt(startedAt: startedAt, week: runtime.week, block: $1)
        }
        return next
    }
}
