# Session 6 — Techlith Inventory Core RC-1

Standalone classroom release candidate for **System Acceptance, Smoke Test, dan Implementation Readiness**. This build supports manual testing against a local Firestore Emulator. It is a classroom test subject, not a production-ready application.

## Local-only safety boundary

- Firebase project: `demo-techlith-inventory-session-6` (demo project ID).
- Firestore Emulator: `127.0.0.1:8080`.
- Emulator UI: `127.0.0.1:4000`.
- Classroom app: `127.0.0.1:3000`.
- The client always connects to the emulator and refuses to run outside the expected local app origin.
- The seed script checks the project and emulator configuration and refuses configured production credentials or project settings.
- No production Firebase project or credentials are included. There is no production fallback or deploy script.
- Emulator rules allow unauthenticated local classroom access. **Never deploy these rules or expose emulator ports to a public or untrusted network.**

## Requirements

- Node.js 24 LTS is recommended for a new classroom setup. The package declares Node.js `>=20`; runtime behavior on Node 24 has not been verified as part of this implementation context.
- npm.
- Java 21 or later for the Firestore Emulator.
- A browser and free local ports 3000, 4000, and 8080.
- No Firebase login or production credentials.

Check your tools before starting:

```sh
node --version
npm --version
java -version
```

## Install and start

Open a terminal in the extracted `session-6-release-candidate-classroom` folder and install its standalone dependencies:

```sh
npm ci
```

Use two terminals in that folder.

**Terminal 1 — start Firestore Emulator:**

```sh
npm run emulators
```

Wait for the Firestore Emulator to report that it is ready. It binds to `127.0.0.1:8080`; the Emulator UI binds to `127.0.0.1:4000`.

**Terminal 2 — reset data, then start the app:**

```sh
npm run seed
npm start
```

Open the app at <http://127.0.0.1:3000> and the Emulator UI at <http://127.0.0.1:4000>. The app uses strict port handling and exits if port 3000 is already occupied.

## Baseline dataset

| Kode Barang | Nama | Amount | Amount type |
|---|---|---:|---|
| ITM-001 | Kain Katun | 10 | meter |
| ITM-002 | Benang Hitam | 5 | roll |
| ITM-003 | Resleting | 100 | pcs |

Every item starts with `stocktakingHistory: []`; the `stocktakings` collection starts empty. `npm run seed` resets only these two classroom collections. It does not run automatically. Confirm the emulator is ready before seeding.

## Transaction behavior

The app uses one Firestore transaction for each stocktaking operation. It reads the selected item, validates the operation, buffers the stocktaking record, updates the item amount, and appends that transaction ID to the item's history in the same commit. It reports success only after Firestore commits the transaction.

Inbound and outbound amounts must be positive integers. Outbound equal to available stock is allowed and results in zero. Outbound greater than available stock is rejected without writes.

The **Failure injection · untuk ACC-05** control offers:

- **Tidak ada:** run a normal operation.
- **stocktaking-write:** inject a controlled error at the stocktaking write stage inside the Firestore transaction.
- **item-update:** buffer the stocktaking write, then inject a controlled error at the item update stage. The transaction aborts before commit.

Injected failures should produce an error message, not a success message. Students must inspect actual item, stocktaking, and history data before recording a result. Reset the dataset between independent cases that require baseline stock.

## Smoke test sequence

Record your own actual result, status, and evidence. The interface does not grade cases.

1. **SMK-01:** Open the app and observe whether it loads without a fatal error.
2. **SMK-02:** Verify that all three baseline items are displayed.
3. **SMK-03:** Run inbound 1 for ITM-001. Inspect stock and Firestore records.
4. **SMK-04:** After SMK-03, run outbound 1 for ITM-001. Inspect stock and records again.
5. **SMK-05:** Compare item amounts, stocktaking documents, and item history references in Data Inspector and Emulator UI.

After smoke testing, run `npm run seed` to restore the acceptance baseline.

## Acceptance scenario overview

- **ACC-01:** Confirm ITM-001 shows 10 meter and empty history.
- **ACC-02:** From baseline, inbound 5; inspect resulting item and transaction data.
- **ACC-03:** Reset, then outbound 10; inspect the resulting zero stock and transaction values.
- **ACC-04:** Reset, then outbound 11; verify rejection and unchanged data.
- **ACC-05:** From a fresh baseline for each run, try both controlled failure modes; compare runtime messages with actual Firestore state.

Capture screenshots or other evidence with the case ID in the filename. Record preconditions, expected and actual results, status, and the Firestore state you checked. A UI success message alone is not evidence of data consistency. Do not alter observations to match an expected result.

## Troubleshooting

- **Emulator does not start:** verify Java 21 or later and check whether local ports 8080 or 4000 are already in use.
- **Seed refuses to run:** start the emulator first; check `firebase.json`, `.firebaserc`, and environment project/credential settings. The seed fails closed when they do not match the local demo setup.
- **App stays disconnected:** confirm the emulator is ready at `127.0.0.1:8080`, then reload the app.
- **App cannot start on port 3000:** close only the process you own that is using that classroom port; the app will not silently move to another port.
- **A transaction is rejected:** inspect the runtime message and current Firestore documents; verify the item, amount, and stock precondition.
- **Scenario needs a clean initial stock:** run `npm run seed` after confirming the local emulator is the target.

## Stop local processes

Press `Ctrl+C` in each terminal running the emulator or app. Do not run Firebase deployment commands. Do not use production Firebase, production credentials, or public network exposure for this classroom build.
