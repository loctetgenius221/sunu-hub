import { describe, expect, it } from 'vitest'
import { applyFilters, emptyFilters } from '../filters'
import { reminders } from '../matching'
import { opportunities } from '@/data/opportunities'

const now = new Date('2026-10-03')

describe('applyFilters', () => {
  it('cherche sans tenir compte des accents ni de la casse', () => {
    const r = applyFilters(opportunities, { ...emptyFilters(), q: 'DEVELOPPEUR' }, now)
    expect(r.map((o) => o.id)).toEqual(['o1', 'o12'])
  })

  it('garde les offres à distance quand on filtre par ville', () => {
    const r = applyFilters(opportunities, { ...emptyFilters(), city: 'Thiès' }, now)
    expect(r.every((o) => o.city === 'Thiès' || o.remote)).toBe(true)
    expect(r.some((o) => o.remote)).toBe(true)
  })

  it('combine type et date limite', () => {
    const r = applyFilters(opportunities, { ...emptyFilters(), types: ['stage'], within: '30' }, now)
    expect(r.map((o) => o.id).sort()).toEqual(['o1', 'o7'])
  })
})

describe('reminders', () => {
  it('programme J-7 et J-1, sans rappel déjà passé', () => {
    expect(reminders('2026-10-24', now).map((r) => r.label)).toEqual(['J-7', 'J-1'])
    expect(reminders('2026-10-06', now).map((r) => r.label)).toEqual(['J-1'])
  })
})
