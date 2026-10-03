import { describe, expect, it } from 'vitest'
import { scoreOpportunity } from '../matching'
import { opportunities } from '@/data/opportunities'
import { structures } from '@/data/structures'
import type { Profile } from '@/types'

const profile: Profile = {
  phone: '770000000',
  firstName: 'Awa',
  stage: 'etudiant',
  level: 'licence',
  field: 'informatique',
  city: 'Dakar',
  goal: 'stage',
}
const now = new Date('2026-10-03')

describe('scoreOpportunity', () => {
  it('donne 100 à une offre qui coche tous les critères', () => {
    const o = opportunities.find((x) => x.id === 'o1')!
    const s = scoreOpportunity(o, structures[0]!, profile, now)
    expect(s.score).toBe(100)
    expect(s.reasons).toContain('correspond à ta filière')
  })

  it("met 0 en disponibilité quand la date limite est passée", () => {
    const o = { ...opportunities[0]!, deadline: '2026-10-01' }
    expect(scoreOpportunity(o, structures[0]!, profile, now).score).toBe(85)
  })

  it('classe une offre hors filière plus bas', () => {
    const o = opportunities.find((x) => x.id === 'o5')!
    expect(scoreOpportunity(o, structures[4]!, profile, now).score).toBeLessThan(60)
  })
})
