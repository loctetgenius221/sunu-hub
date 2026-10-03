import type { Level, Opportunity, OpportunityType } from '@/types'
import { daysLeft } from './matching'

// Recherche et filtres du fil (TDR Q3). Fonction pure : les filtres viennent de l'URL.

export interface Filters {
  q: string
  types: OpportunityType[]
  level: Level | ''
  field: string
  city: string
  within: '' | '7' | '30' // date limite dans les N jours
}

export const emptyFilters = (): Filters => ({ q: '', types: [], level: '', field: '', city: '', within: '' })

/** Minuscules sans accents, pour comparer des saisies libres. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export function applyFilters<T extends Opportunity & { structure?: { name: string } }>(items: T[], f: Filters, now = new Date()): T[] {
  const q = normalize(f.q.trim())
  return items.filter((o) => {
    if (q && !normalize(`${o.title} ${o.summary} ${o.structure?.name ?? ''}`).includes(q)) return false
    if (f.types.length && !f.types.includes(o.type)) return false
    if (f.level && !o.levels.includes(f.level) && !o.levels.includes('tous')) return false
    if (f.field && !o.fields.includes(f.field)) return false
    if (f.city && !(o.city === f.city || o.remote)) return false
    if (f.within && daysLeft(o.deadline, now) > Number(f.within)) return false
    return true
  })
}

export const activeCount = (f: Filters) =>
  [f.q.trim(), f.types.length, f.level, f.field, f.city, f.within].filter(Boolean).length
