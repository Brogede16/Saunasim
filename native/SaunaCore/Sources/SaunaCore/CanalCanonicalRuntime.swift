import Foundation

public struct CanalConstructionProject: Codable, Equatable, Sendable {
    public var moduleID: String
    public var completesAt: Int64

    public init(moduleID: String, completesAt: Int64) {
        self.moduleID = moduleID
        self.completesAt = completesAt
    }
}

public struct CanalRepairTask: Codable, Equatable, Sendable {
    public var moduleID: String
    public var completesAt: Int64

    public init(moduleID: String, completesAt: Int64) {
        self.moduleID = moduleID
        self.completesAt = completesAt
    }
}

public struct CanalCanonicalReport: Codable, Equatable, Sendable {
    public var admissions: Int
    public var specialSeats: Int
    public var revenue: Double
    public var operatingCosts: Double
    public var loanRepayment: Double
    public var netResult: Double

    public init(
        admissions: Int,
        specialSeats: Int,
        revenue: Double,
        operatingCosts: Double,
        loanRepayment: Double,
        netResult: Double
    ) {
        self.admissions = admissions
        self.specialSeats = specialSeats
        self.revenue = revenue
        self.operatingCosts = operatingCosts
        self.loanRepayment = loanRepayment
        self.netResult = netResult
    }
}

public struct CanalWorldState: Codable, Equatable, Sendable {
    public var cash: Double
    public var week: Int
    public var built: Set<String>
    public var master: MasterProfile?
    public var admissionPrice: Double
    public var schedule: VenueSchedule
    public var program: ActiveProgram
    public var serviceHostCount: Int
    public var loanRepayment: Double
    public var construction: [CanalConstructionProject]
    public var condition: [String: Double]
    public var repairTask: CanalRepairTask?
    public var lastReport: CanalCanonicalReport?

    public init(
        cash: Double,
        week: Int = 1,
        built: Set<String>,
        master: MasterProfile?,
        admissionPrice: Double,
        schedule: VenueSchedule,
        program: ActiveProgram = .starter,
        serviceHostCount: Int = 0,
        loanRepayment: Double = 0,
        construction: [CanalConstructionProject] = [],
        condition: [String: Double] = [:],
        repairTask: CanalRepairTask? = nil,
        lastReport: CanalCanonicalReport? = nil
    ) {
        self.cash = cash
        self.week = week
        self.built = built
        self.master = master
        self.admissionPrice = admissionPrice
        self.schedule = schedule
        self.program = program
        self.serviceHostCount = serviceHostCount
        self.loanRepayment = loanRepayment
        self.construction = construction
        self.condition = condition
        self.repairTask = repairTask
        self.lastReport = lastReport
    }

    public var operatingInput: CanalOperatingInput {
        let operationalBuilt = Set(built.filter { id in
            (condition[id] ?? 100) > 0 && repairTask?.moduleID != id
        })
        return CanalOperatingInput(
            cash: cash,
            built: operationalBuilt,
            master: master,
            admissionPrice: admissionPrice,
            schedule: schedule,
            program: program,
            serviceHostCount: serviceHostCount,
            loanRepayment: loanRepayment
        )
    }
}

public struct CanalCanonicalState: Codable, Equatable, Sendable {
    public var world: CanalWorldState
    public var operatingRuntime: OperatingWeekRuntime?

    public init(world: CanalWorldState, operatingRuntime: OperatingWeekRuntime? = nil) {
        self.world = world
        self.operatingRuntime = operatingRuntime
    }
}

public typealias CanalCanonicalEnvelope = SimulationEnvelope<CanalCanonicalState>

public enum CanalCanonicalRuntime {
    public static func createEnvelope(
        world: CanalWorldState,
        startedAt: Int64,
        seed: Int64
    ) -> CanalCanonicalEnvelope {
        SimulationEnvelope(
            startedAt: startedAt,
            lastSimulatedAt: startedAt,
            rng: DeterministicRNG.createState(seed: seed),
            world: CanalCanonicalState(world: world)
        )
    }

    public static func advance(
        _ envelope: CanalCanonicalEnvelope,
        to: Int64
    ) throws -> AdvanceSimulationResult<CanalCanonicalState> {
        try SimulationEngine.advance(envelope, to: to, adapter: adapter)
    }

    public static func setAdmissionPrice(
        _ envelope: CanalCanonicalEnvelope,
        value: Double
    ) -> CanalCanonicalEnvelope {
        applyWorldChange(envelope) { world in
            var next = world
            next.admissionPrice = value
            return next
        }
    }

    public static func setProgramIntent(
        _ envelope: CanalCanonicalEnvelope,
        value: ProgramIntent
    ) -> CanalCanonicalEnvelope {
        applyWorldChange(envelope) { world in
            var next = world
            next.program.intent = value
            return next
        }
    }

    /// Instantaneous domain changes happen only after the caller advances to the command time.
    /// Existing settled history is preserved; only future blocks are rebuilt from the changed world.
    public static func applyWorldChange(
        _ envelope: CanalCanonicalEnvelope,
        change: (CanalWorldState) -> CanalWorldState
    ) -> CanalCanonicalEnvelope {
        var next = envelope
        next.world.world = change(next.world.world)
        if let runtime = next.world.operatingRuntime {
            next.world.operatingRuntime = CanalRuntimeReplan.replanFuture(
                input: next.world.world.operatingInput,
                runtime: runtime,
                startedAt: next.startedAt,
                at: next.lastSimulatedAt
            )
        }
        return next
    }

    public static func encode(_ envelope: CanalCanonicalEnvelope) throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]
        return try encoder.encode(envelope)
    }

    public static func decode(_ data: Data) throws -> CanalCanonicalEnvelope {
        try JSONDecoder().decode(CanalCanonicalEnvelope.self, from: data)
    }

    private static let adapter = SimulationAdapter<CanalCanonicalState>(
        nextMilestoneAt: { state, after, to, startedAt in
            let runtime = runtimeFor(state)
            let operating = runtime.plannedBlocks
                .filter { !runtime.settledBlockKeys.contains($0.key) }
                .map { CanalRuntimeReplan.blockSettlesAt(startedAt: startedAt, week: runtime.week, block: $0) }
            let work = state.world.construction.map(\.completesAt) + [state.world.repairTask?.completesAt].compactMap { $0 }
            return (operating + work)
                .filter { $0 > after && $0 <= to }
                .min()
        },
        advanceInterval: { state, context in
            SimulationStepResult(world: state, rng: context.rng)
        },
        resolveMilestonesAt: { state, at, rng, startedAt in
            var next = state
            var events: [SimulationEvent] = []
            var operatingInputsChanged = false

            let completedConstruction = next.world.construction.filter { $0.completesAt <= at }
            if !completedConstruction.isEmpty {
                for project in completedConstruction {
                    next.world.built.insert(project.moduleID)
                    events.append(SimulationEvent(
                        at: at,
                        type: "construction-completed",
                        detail: project.moduleID
                    ))
                }
                next.world.construction.removeAll { $0.completesAt <= at }
                operatingInputsChanged = true
            }

            if let repair = next.world.repairTask, repair.completesAt <= at {
                next.world.condition[repair.moduleID] = 100
                next.world.repairTask = nil
                operatingInputsChanged = true
                events.append(SimulationEvent(
                    at: at,
                    type: "repair-completed",
                    detail: repair.moduleID
                ))
            }

            if operatingInputsChanged, let existing = next.operatingRuntime {
                next.operatingRuntime = CanalRuntimeReplan.replanFuture(
                    input: next.world.operatingInput,
                    runtime: existing,
                    startedAt: startedAt,
                    at: at
                )
            }

            var runtime = runtimeFor(next)
            for block in runtime.plannedBlocks {
                guard !runtime.settledBlockKeys.contains(block.key) else { continue }
                let settlesAt = CanalRuntimeReplan.blockSettlesAt(
                    startedAt: startedAt,
                    week: runtime.week,
                    block: block
                )
                guard settlesAt == at else { continue }
                runtime = OperatingRuntime.settle(block, into: runtime)
                next.world.cash = money(next.world.cash + block.operatingNet)
                events.append(SimulationEvent(
                    at: at,
                    type: "operating-block-settled",
                    detail: block.key
                ))
            }
            next.operatingRuntime = runtime
            return SimulationStepResult(world: next, rng: rng, events: events)
        },
        resolveGameWeekBoundary: { state, at, rng, _ in
            var next = state
            let runtime = runtimeFor(next)
            let period = CanalPeriodCosts.calculate(built: next.world.operatingInput.built)
            let revenue = money(
                runtime.accruedRevenue.admissions
                    + runtime.accruedRevenue.specialGus
                    + runtime.accruedRevenue.shop
            )
            let variableCosts = money(
                runtime.accruedCosts.venueBase
                    + runtime.accruedCosts.staff
                    + runtime.accruedCosts.utilitiesAndCleaning
                    + runtime.accruedCosts.programMaterials
                    + runtime.accruedCosts.shopProcurement
                    + runtime.accruedCosts.facilities
            )
            let operatingCosts = money(variableCosts + period.total)
            let netResult = money(revenue - operatingCosts - next.world.loanRepayment)

            // Block operating net has already moved cash in real time. The boundary applies only
            // fixed period obligations and debt, exactly once.
            next.world.cash = money(next.world.cash - period.total - next.world.loanRepayment)
            next.world.lastReport = CanalCanonicalReport(
                admissions: runtime.accruedAdmissions,
                specialSeats: runtime.accruedSpecialSeats,
                revenue: revenue,
                operatingCosts: operatingCosts,
                loanRepayment: next.world.loanRepayment,
                netResult: netResult
            )
            next.world.week += 1
            next.operatingRuntime = nil
            return SimulationStepResult(
                world: next,
                rng: rng,
                events: [SimulationEvent(at: at, type: "game-week-settled")]
            )
        }
    )

    private static func runtimeFor(_ state: CanalCanonicalState) -> OperatingWeekRuntime {
        if let runtime = state.operatingRuntime, runtime.week == state.world.week {
            return runtime
        }
        return OperatingWeekRuntime(
            week: state.world.week,
            plannedBlocks: CanalBlockPlanner.plan(state.world.operatingInput)
        )
    }

    private static func money(_ value: Double) -> Double {
        (value * 100).rounded() / 100
    }
}
