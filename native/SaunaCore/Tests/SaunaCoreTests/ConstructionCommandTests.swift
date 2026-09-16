import XCTest
@testable import SaunaCore

final class ConstructionCommandTests: XCTestCase {
    private func envelope(cash: Double = 10_000) -> CanalCanonicalEnvelope {
        CanalCanonicalRuntime.createEnvelope(
            world: CanalWorldState(
                cash: cash,
                built: [],
                master: nil,
                admissionPrice: 24,
                schedule: VenueSchedule(openDays: 5, opensAt: 10, closesAt: 20)
            ),
            startedAt: 1_000_000,
            seed: 17
        )
    }

    func testOnlyOneMajorProjectCanBeActiveAtVenue() throws {
        let first = try CanalConstructionCommands.start(envelope(), moduleID: "arrival")
        XCTAssertEqual(first.world.world.cash, 8_800)
        XCTAssertEqual(first.world.world.construction.count, 1)
        XCTAssertEqual(first.world.world.construction.first?.moduleID, "arrival")
        XCTAssertEqual(first.world.world.construction.first?.completesAt, 4_600_000)

        XCTAssertThrowsError(try CanalConstructionCommands.start(first, moduleID: "shower")) { error in
            XCTAssertEqual(error as? CanalConstructionCommandError, .projectAlreadyActive)
        }
    }

    func testRushUsesMoneyWithoutCreatingContractorState() throws {
        let started = try CanalConstructionCommands.start(envelope(), moduleID: "arrival")
        let rushed = try CanalConstructionCommands.rush(started, moduleID: "arrival")

        XCTAssertEqual(rushed.world.world.cash, 8_500) // 1,200 build + 300 rush
        XCTAssertTrue(rushed.world.world.built.contains("arrival"))
        XCTAssertTrue(rushed.world.world.construction.isEmpty)
    }

    func testConstructionCommandsRespectCashAndBuiltState() throws {
        XCTAssertThrowsError(try CanalConstructionCommands.start(envelope(cash: 500), moduleID: "arrival")) { error in
            XCTAssertEqual(error as? CanalConstructionCommandError, .insufficientCash)
        }

        var builtEnvelope = envelope()
        builtEnvelope.world.world.built.insert("arrival")
        XCTAssertThrowsError(try CanalConstructionCommands.start(builtEnvelope, moduleID: "arrival")) { error in
            XCTAssertEqual(error as? CanalConstructionCommandError, .alreadyBuilt)
        }
    }
}
