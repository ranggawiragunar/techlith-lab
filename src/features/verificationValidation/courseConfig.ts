export type DeliveryModel = 'Mini Case' | 'Praktikum'
export type SessionStatus = 'planned' | 'available'

export interface CourseSession {
  number: number
  title: string
  deliveryModel: DeliveryModel
  status: SessionStatus
}

export const verificationValidationCourse = {
  slug: 'verification-validation',
  title: 'Konsep Verifikasi dan Validasi Perangkat Lunak',
  caseName: 'Techlith Lab Inventory',
  baseRoute: '/admin/classroom/verification-validation',
  sessions: [
    {
      number: 1,
      title: 'Menentukan Sasaran dan Level Pengujian pada Techlith Lab Inventory',
      deliveryModel: 'Mini Case',
      status: 'available',
    },
    {
      number: 2,
      title: 'Merancang Test Berbasis Objective, Experience, dan Input Domain pada Techlith Lab Inventory',
      deliveryModel: 'Mini Case',
      status: 'available',
    },
    {
      number: 3,
      title: 'Menguji Kode, Fault, Usage, dan Model pada Techlith Lab Inventory',
      deliveryModel: 'Praktikum',
      status: 'available',
    },
    {
      number: 4,
      title: 'Memilih Kombinasi Teknik dan Membaca Test Metrics pada Techlith Lab Inventory',
      deliveryModel: 'Mini Case',
      status: 'available',
    },
    {
      number: 5,
      title: 'Mengevaluasi Test Suite dengan Coverage, Mutation, dan Work Products pada Techlith Lab Inventory',
      deliveryModel: 'Praktikum',
      status: 'available',
    },
    {
      number: 6,
      title: 'Menjalankan Test Activities dengan Tool Support dan Defect Tracking pada Techlith Lab Inventory',
      deliveryModel: 'Praktikum',
      status: 'available',
    },
    {
      number: 7,
      title: 'Menyusun Software Testing Document dan Ringkasan Presentasi pada Techlith Lab Inventory',
      deliveryModel: 'Praktikum',
      status: 'planned',
    },
  ] satisfies CourseSession[],
} as const
