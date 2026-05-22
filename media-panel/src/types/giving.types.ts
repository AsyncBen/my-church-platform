export type GivingRecordType = 'tithe' | 'offering' | 'special'

export interface GivingRecord {
  id: string
  name: string
  amount: number
  ref: string
  service: string
  date: string
  type: GivingRecordType
}

export interface GivingReport {
  id: string
  amount: number
  date: string
}
