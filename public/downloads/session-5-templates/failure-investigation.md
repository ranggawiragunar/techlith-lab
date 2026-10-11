# Failure Investigation — Sesi 5

Catat observasi aktual setelah memeriksa UI dan Firestore Emulator. Jangan simpulkan hasil dari runtime message saja.

## ERR-01

- **Scenario ID:** ERR-01
- **Failure Injection:** `stocktaking-write`
- **Selected Flow:** Baseline
- **Initial State:** ITM-001 amount=10; stocktakings kosong; history kosong.
- **Runtime Messages:**
- **Item State:**
- **Stocktaking State:**
- **History State:**
- **Expected Consistency:** Tidak ada stocktaking; item tetap 10; history kosong; warning saja.
- **Actual Observation:**
- **Evidence:**
- **Investigation Notes:**

## ERR-02

- **Scenario ID:** ERR-02
- **Failure Injection:** `item-update`
- **Selected Flow:** Baseline
- **Initial State:** ITM-001 amount=10; stocktakings kosong; history kosong.
- **Runtime Messages:**
- **Item State:**
- **Stocktaking State:**
- **History State:**
- **Expected Consistency:** Stocktaking yang sempat dibuat di-rollback; item tetap 10; history kosong; warning saja.
- **Actual Observation:**
- **Evidence:**
- **Investigation Notes:**
