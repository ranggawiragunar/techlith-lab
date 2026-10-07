import { db } from './database'
import type { Item, User } from '../types/models'

const timestamp = '2026-01-01T00:00:00.000Z'

export const adminSeed: User = {
  id: 'USR-ADMIN-001',
  username: 'admin',
  password: 'admin123',
  role: 'ADMIN',
  displayName: 'Lab Administrator',
  createdAt: timestamp,
}

export const itemSeeds: Item[] = [
  { id: 'ITM-001', code: 'BRG-001', name: 'Kain Katun', category: 'Fabric', description: 'Kain katun untuk kebutuhan produksi garment.', stock: 10, unit: 'meter', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-002', code: 'BRG-002', name: 'Kain Denim', category: 'Fabric', description: 'Kain denim warna indigo.', stock: 24, unit: 'meter', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-003', code: 'BRG-003', name: 'Benang Hitam', category: 'Thread', description: 'Benang jahit polyester warna hitam.', stock: 18, unit: 'cone', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-004', code: 'BRG-004', name: 'Benang Putih', category: 'Thread', description: 'Benang jahit polyester warna putih.', stock: 20, unit: 'cone', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-005', code: 'BRG-005', name: 'Resleting', category: 'Trims', description: 'Resleting nilon 20 cm.', stock: 100, unit: 'pcs', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-006', code: 'BRG-006', name: 'Kancing', category: 'Trims', description: 'Kancing resin hitam 15 mm.', stock: 250, unit: 'pcs', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-007', code: 'BRG-007', name: 'Label Merek', category: 'Trims', description: 'Label woven Techlith.', stock: 80, unit: 'pcs', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-008', code: 'BRG-008', name: 'Karet Pinggang', category: 'Trims', description: 'Karet elastis lebar 3 cm.', stock: 35, unit: 'meter', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-009', code: 'BRG-009', name: 'Interfacing', category: 'Fabric', description: 'Interfacing fusible ringan.', stock: 16, unit: 'meter', isActive: true, createdAt: timestamp, updatedAt: timestamp },
  { id: 'ITM-010', code: 'BRG-010', name: 'Plastik Packaging', category: 'Packaging', description: 'Plastik kemasan transparan ukuran medium.', stock: 120, unit: 'pcs', isActive: true, createdAt: timestamp, updatedAt: timestamp },
]

export async function initializeDatabase(): Promise<void> {
  await db.transaction('rw', db.users, db.items, async () => {
    if (!(await db.users.get(adminSeed.id))) await db.users.add(adminSeed)
    for (const item of itemSeeds) {
      if (!(await db.items.get(item.id))) await db.items.add(item)
    }
  })
}
