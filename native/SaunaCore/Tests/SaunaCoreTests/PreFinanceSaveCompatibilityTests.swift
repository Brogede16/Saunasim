import Foundation
import XCTest
@testable import SaunaCore

final class PreFinanceSaveCompatibilityTests: XCTestCase {
    func testPreFinanceWorldPayloadGetsFinanceDefaults() throws {
        let json = """
        {
          "cash": 3350,
          "week": 1,
          "built": [],
          "admissionPrice": 24,
          "schedule": { "openDays": 5, "opensAt": 10, "closesAt": 20 },
          "program": {
            "name": "Canal Ritual",
            "intent": "Classic Ritual",
            "requestedSessions": 2,
            "supplementPrice": 7,
            "roomMinutes": 14,
            "materialCostPerSession": 4,
            "recoveryFinish": "No Added Finish"
          },
          "serviceHostCount": 0,
          "loanRepayment": 0,
          "shopRange": ["cold-water", "sauna-towel", "house-blend"],
          "hasBrandIdentity": false,
          "construction": [],
          "condition": {}
        }
        """

        let world = try JSONDecoder().decode(CanalWorldState.self, from: Data(json.utf8))
        XCTAssertEqual(world.loans, [])
        XCTAssertEqual(world.profitableWeeks, 0)
        XCTAssertFalse(world.financialDecisionPending)
        XCTAssertEqual(world.scheduledLoanRepayment, 0)
    }
}
