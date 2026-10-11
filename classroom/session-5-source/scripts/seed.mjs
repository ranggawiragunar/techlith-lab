import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { request as httpRequest } from 'node:http'

const PROJECT_ID = 'demo-techlith-inventory-classroom'
const EMULATOR_HOST = '127.0.0.1:8080'

function requireLocalEmulatorResponse() {
  return new Promise((resolve, reject) => {
    const request = httpRequest(`http://${EMULATOR_HOST}/`, (response) => {
      response.resume()
      resolve(response.statusCode)
    })
    request.setTimeout(2000, () => request.destroy(new Error('connection timed out')))
    request.on('error', reject)
    request.end()
  })
}

async function main() {
  const requestedHost = process.env.FIRESTORE_EMULATOR_HOST
  if (requestedHost && requestedHost !== EMULATOR_HOST) {
    throw new Error(`Refusing to seed: FIRESTORE_EMULATOR_HOST must be ${EMULATOR_HOST}.`)
  }

  const requestedProject = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT
  if (requestedProject && requestedProject !== PROJECT_ID) {
    throw new Error(`Refusing to seed: project must be ${PROJECT_ID}, not ${requestedProject}.`)
  }

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
  const collections = await db.listCollections()
  if (!Array.isArray(collections)) {
    throw new Error('Refusing to seed: local Firestore Emulator did not return a collection list.')
  }

  for (const name of ['stocktakings', 'items']) {
    const collection = db.collection(name)
    while (true) {
      const snapshot = await collection.limit(400).get()
      if (snapshot.empty) break
      const batch = db.batch()
      snapshot.docs.forEach((document) => batch.delete(document.ref))
      await batch.commit()
    }
  }

  const items = [
    { id: 'ITM-001', name: 'Kain Katun', amount: 10, unit: 'meter' },
    { id: 'ITM-002', name: 'Benang Hitam', amount: 5, unit: 'roll' },
    { id: 'ITM-003', name: 'Resleting', amount: 100, unit: 'pcs' },
  ]

  const seedBatch = db.batch()
  for (const item of items) {
    seedBatch.set(db.collection('items').doc(item.id), {
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      stocktakingHistory: [],
    })
  }
  await seedBatch.commit()

  const [itemSnapshot, stocktakingSnapshot] = await Promise.all([
    db.collection('items').get(),
    db.collection('stocktakings').get(),
  ])
  if (itemSnapshot.size !== 3 || stocktakingSnapshot.size !== 0) {
    throw new Error(`Seed verification failed: ${itemSnapshot.size} items, ${stocktakingSnapshot.size} stocktakings.`)
  }

  console.log(`Seeded ${PROJECT_ID} through ${EMULATOR_HOST}.`)
  console.log('Items: ITM-001=10 meter, ITM-002=5 roll, ITM-003=100 pcs.')
  console.log('stocktakingHistory is empty; stocktakings contains 0 documents.')
  await app.delete()
}

main().catch((error) => {
  console.error('Seed stopped without targeting production:', error instanceof Error ? error.message : error)
  process.exitCode = 1
})
