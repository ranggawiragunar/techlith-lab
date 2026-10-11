import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

export const DEMO_PROJECT_ID = 'demo-techlith-inventory-classroom'
export const EMULATOR_HOST = '127.0.0.1'
export const EMULATOR_PORT = 8080

if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  throw new Error('Classroom Build hanya dapat dijalankan pada localhost.')
}

const app = initializeApp({ projectId: DEMO_PROJECT_ID })
if (app.options.projectId !== DEMO_PROJECT_ID) {
  throw new Error('Project Firebase tidak sesuai dengan project demo Classroom Build.')
}

export const db = getFirestore(app)
connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT)
