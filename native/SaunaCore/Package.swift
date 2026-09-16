// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "SaunaCore",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        .library(name: "SaunaCore", targets: ["SaunaCore"]),
    ],
    targets: [
        .target(name: "SaunaCore"),
        .testTarget(name: "SaunaCoreTests", dependencies: ["SaunaCore"]),
    ]
)
