# Sauna Empire Agent Workflow

## Purpose

This is the required operating procedure for coding agents working on substantial Sauna Empire tasks.

## Standard workflow

1. Read `AI_INSTRUCTIONS.md`.
2. Read the relevant system documents.
3. Inspect the existing implementation and its tests.
4. State a short implementation plan.
5. Implement only the requested feature or fix.
6. Build the affected target.
7. Run relevant tests.
8. Fix errors introduced by the change.
9. Rebuild and rerun tests.
10. Check for regressions in adjacent systems.
11. Update the repository documentation immediately when a meaningful decision, mechanic, conflict resolution, implementation status, migration rule, balance ownership rule, save contract or architectural boundary changes.
12. Provide a concise changelog.

## Scope discipline

- Do not combine a feature task with unrelated cleanup.
- Do not rename/reorganize broad areas unless the task requires it.
- Prefer one system boundary at a time.
- If a prerequisite is broken, fix the smallest prerequisite necessary and document it.
- Never hide a failing test by deleting it or weakening expectations without an intentional product-rule change.

## Before implementation

An agent should be able to answer:

- What system owns this behavior?
- What is the current source of truth?
- Is the behavior already implemented in TypeScript, only in Empire rebuild, or only in docs?
- Does the task affect save compatibility?
- Does it change balance values?
- Does it affect asset contracts?
- Can it be tested headlessly?

If those answers are unclear, inspect more repository context before coding.

## Continuous repository memory

Important project knowledge must not live only in chat.

During substantial work, write repository updates as soon as they become meaningful rather than waiting for a final documentation pass. This includes:

- newly approved or superseded product decisions;
- mechanics and their downstream consequences;
- source-of-truth conflict resolutions;
- newly discovered implementation constraints or technical debt;
- implementation-matrix status changes such as `SPECIFIED`, `PARTIAL` or `IMPLEMENTED`;
- new or changed data/save contracts;
- balance variables and which system owns them;
- migration fixtures and compatibility rules;
- tests that become canonical proof of behavior;
- deliberately deferred work and why it remains deferred.

Update the existing canonical file whenever one clearly owns the information. Create a new document only when the subject needs a distinct long-lived contract, review or decision record.

Do not produce documentation churn for trivial code movement, formatting-only changes or facts already represented accurately elsewhere. The goal is a repo that another agent can understand without relying on conversation history.

## During native migration

Use a strangler-style workflow, not a big rewrite:

1. select one behavior;
2. preserve/capture reference fixtures;
3. port models required for that behavior;
4. implement the Swift system;
5. compare outputs;
6. integrate with the application layer;
7. leave old browser reference intact until the native result is proven.

## Build policy

An agent may not finish with a knowingly failing build caused by its work.

If an unrelated pre-existing failure exists:

- verify it existed before the change when possible;
- report it clearly;
- do not claim the branch is green.

## Test policy

At minimum run tests for the changed system. For cross-system changes, run broader regression tests.

Examples:

- economy change -> economy unit + simulation/regression tests;
- save model change -> save round-trip + migration fixtures;
- SpriteKit change -> build + scene integration tests;
- SwiftUI command wiring -> relevant unit + UI/integration flow;
- balance change -> deterministic tests + batch balance scenario if meaningful.

## Documentation policy

Update documentation when changing:

- architecture boundaries;
- system ownership;
- persistent data model;
- save migration rules;
- asset dimensions/anchors;
- major gameplay rules;
- central balance variables;
- build/test procedures;
- implementation status of canonical mechanics;
- decisions or clarifications that would otherwise exist only in conversation history.

Do not update documents merely to make them sound newer. They must reflect actual behavior or explicitly labeled future design.

## Changelog format

Each completed agent task should summarize:

- What changed
- Why
- Tests/build run
- Save impact
- Balance impact
- Documentation/source-of-truth impact
- Follow-up/TBD items

## Git policy

- Work on a non-destructive branch for substantial preparation/refactor work.
- Keep commits logically scoped.
- Prefer messages such as `docs:`, `test:`, `refactor:`, `feat:`, `fix:`.
- Do not force-push or rewrite shared history unless explicitly requested.
- Do not merge preparation work automatically unless explicitly requested.

## Definition of agent completion

A task is complete only when the requested behavior exists, the project remains buildable, relevant tests pass or known exceptions are documented, meaningful new project knowledge has been written to the appropriate repository source of truth, and no new undocumented source-of-truth ambiguity has been introduced.