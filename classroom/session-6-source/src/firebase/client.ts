import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

export const DEMO_PROJECT_ID = 'demo-techlith-inventory-session-6'
export const EMULATOR_HOST = '127.0.0.1'
export const EMULATOR_PORT = 8080

if (typeof window !== 'undefined') {
  const isExpectedLocalApp = window.location.protocol === 'http:'
    && ['127.0.0.1', 'localhost'].includes(window.location.hostname)
    && window.location.port === '3000'

  if (!isExpectedLocalApp) {
    throw new Error('Release Candidate hanya dapat dijalankan melalui server lokal pada 127.0.0.1:3000.')
  }
}

const app = initializeApp({ projectId: DEMO_PROJECT_ID })
if (app.options.projectId !== DEMO_PROJECT_ID) {
  throw new Error('Project Firebase tidak sesuai dengan project demo Session 6.')
}

export const db = getFirestore(app)
connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT)
