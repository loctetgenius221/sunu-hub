import { describe, expect, it } from 'vitest'
import { accessFor, recommend } from '../orientation'

const base = {
  serie: 'S2',
  mention: 'ab',
  interests: ['informatique'],
  liked: ['maths'],
  strong: ['maths', 'physique'],
  jobs: ['developpeur'],
  team: 'egal',
  place: 'bureau',
  duration: '3',
  budget: '100000',
  city: 'Dakar',
  mobility: 'oui',
  sector: 'public',
  priority: 'emploi',
  family: 'non',
}

describe('recommend', () => {
  it('place en tête la formation qui correspond aux intérêts et aux matières', () => {
    const { top } = recommend(base)
    expect(top[0]?.program.id).toBe('p1')
    expect(top[0]?.reasons).toContain('le domaine qui t’attire')
  })

  it('ne propose jamais un établissement non habilité', () => {
    const { top, wide } = recommend(base)
    expect([...top, ...wide].some((p) => p.school.status === 'non-habilite')).toBe(false)
  })

  it('respecte la série admise', () => {
    const { top, wide } = recommend({ ...base, serie: 'L2', interests: ['informatique', 'lettres'] })
    expect([...top, ...wide].every((p) => !p.program.admittedSeries.length || p.program.admittedSeries.includes('L2'))).toBe(true)
  })

  it('élargit vers des domaines hors des intérêts', () => {
    const { wide } = recommend(base)
    expect(wide.length).toBe(2)
    expect(wide.some((p) => p.field !== 'informatique')).toBe(true)
  })
})

describe('accessFor', () => {
  it('donne une fourchette selon la sélectivité et la mention', () => {
    expect(accessFor('forte', 'tb')).toBe('accessible')
    expect(accessFor('forte', 'passable')).toBe('difficile')
    expect(accessFor('moyenne', 'passable')).toBe('a-tenter')
    expect(accessFor('ouverte', 'passable')).toBe('accessible')
  })
})
