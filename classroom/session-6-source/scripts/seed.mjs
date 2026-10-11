import { readFile } from 'node:fs/promises'
import { request as httpRequest } from 'node:http'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const PROJECT_ID = 'demo-techlith-inventory-session-6'
const EMULATOR_HOST = '127.0.0.1:8080'
const BASELINE = [
  { id: 'ITM-001', name: 'Kain Katun', amount: 10, amountType: 'meter' },
  { id: 'ITM-002', name: 'Benang Hitam', amount: 5, amountType: 'roll' },
  { id: 'ITM-003', name: 'Resleting', amount: 100, amountType: 'pcs' },
]

function requireLocalEmulatorResponse() {
  return new Promise((resolve, reject) => {
    const request = httpRequest(`http://${EMULATOR_HOST}/`, (response) => {
      response.resume()
      if (response.statusCode && response.statusCode < 500) resolve(response.statusCode)
      else reject(new Error(`unexpected HTTP status ${response.statusCode ?? 'unknown'}`))
    })
    request.setTimeout(2000, () => request.destroy(new Error('connection timed out')))
    request.on('error', reject)
    request.end()
  })
}

async function verifyConfiguration() {
  const projectConfig = JSON.parse(await readFile(new URL('../.firebaserc', import.meta.url), 'utf8'))
  const firebaseConfig = JSON.parse(await readFile(new URL('../firebase.json', import.meta.url), 'utf8'))

  if (projectConfig.projects?.default !== PROJECT_ID) {
    throw new Error(`Refusing to seed: .firebaserc must select ${PROJECT_ID}.`)
  }

  const emulator = firebaseConfig.emulators?.firestore
  if (emulator?.host !== '127.0.0.1' || emulator?.port !== 8080) {
    throw new Error('Refusing to seed: firebase.json must bind Firestore to 127.0.0.1:8080.')
  }

  const ui = firebaseConfig.emulators?.ui
  if (ui?.host !== '127.0.0.1' || ui?.port !== 4000) {
    throw new Error('Refusing to seed: Emulator UI must bind to 127.0.0.1:4000.')
  }

  for (const key of ['GCLOUD_PROJECT', 'GOOGLE_CLOUD_PROJECT']) {
    const configuredProject = process.env[key]
    if (configuredProject && configuredProject !== PROJECT_ID) {
      throw new Error(`Refusing to seed: ${key} is ${configuredProject}, expected ${PROJECT_ID}.`)
    }
  }

  if (process.env.FIRESTORE_EMULATOR_HOST && process.env.FIRESTORE_EMULATOR_HOST !== EMULATOR_HOST) {
    throw new Error(`Refusing to seed: FIRESTORE_EMULATOR_HOST must be ${EMULATOR_HOST}.`)
  }

  if (process.env.FIREBASE_CONFIG || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('Refusing to seed: production Firebase configuration or credentials are present in the environment.')
  }
}

async function clearCollection(db, name) {
  const collection = db.collection(name)
  while (true) {
    const snapshot = await collection.limit(400).get()
    if (snapshot.empty) return
    const batch = db.batch()
    snapshot.docs.forEach((document) => batch.delete(document.ref))
    await batch.commit()
  }
}

async function main() {
  await verifyConfiguration()

  try {
    await requireLocalEmulatorResponse()
  } catch (error) {
    throw new Error(`Refusing to seed: Firestore Emulator at ${EMULATOR_HOST} is not reachable (${error.message}).`)
  }

  process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST
  const app = getApps()[0] ?? initializeApp({ projectId: PROJECT_ID })
  if (app.options.projectId !== PROJECT_ID) {
    throw new Error(`Refusing to seed unexpected project: ${app.options.projectId ?? '(unset)'}.`)
  }

  const db = getFirestore(app)
  await clearCollection(db, 'stocktakings')
  await clearCollection(db, 'items')

  const batch = db.batch()
  for (const item of BASELINE) {
    const { id, ...fields } = item
    batch.set(db.collection('items').doc(id), { ...fields, stocktakingHistory: [] })
  }
  await batch.commit()

  const [itemSnapshot, stocktakingSnapshot] = await Promise.all([
    db.collection('items').get(),
    db.collection('stocktakings').get(),
  ])
  const actualItems = new Map(itemSnapshot.docs.map((document) => [document.id, document.data()]))
  const isBaselineCorrect = BASELINE.every((expected) => {
    const actual = actualItems.get(expected.id)
    return actual?.name === expected.name
      && actual?.amount === expected.amount
      && actual?.amountType === expected.amountType
      && Array.isArray(actual?.stocktakingHistory)
      && actual.stocktakingHistory.length === 0
  })

  if (itemSnapshot.size !== BASELINE.length || stocktakingSnapshot.size !== 0 || !isBaselineCorrect) {
    throw new Error(`Seed verification failed: ${itemSnapshot.size} items, ${stocktakingSnapshot.size} stocktakings, baselineCorrect=${isBaselineCorrect}.`)
  }

  console.log(`Seeded ${PROJECT_ID} through ${EMULATOR_HOST}.`)
  console.log('Items: ITM-001=10 meter, ITM-002=5 roll, ITM-003=100 pcs.')
  console.log('stocktakingHistory is empty; stocktakings contains 0 documents.')
  await app.delete()
}

main().catch((error) => {
  console.error('Seed stopped without targeting production:', error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
