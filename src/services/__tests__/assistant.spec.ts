import { describe, expect, it } from 'vitest'
import { answer } from '../assistant'

describe('assistant', () => {
  it('répond sur une école avec sa source et sa date', () => {
    const r = answer('L’ICVM est-elle reconnue ?')
    expect(r.text).toContain('Institut Cap-Vert Management')
    expect(r.sources[0]?.date).toBeTruthy()
  })

  it('explique un statut officiel', () => {
    expect(answer('Que veut dire habilitation ?').text).toMatch(/^Habilitation/)
  })

  it('liste les formations d’un domaine sans établissement non habilité', () => {
    const r = answer('Quelles formations en informatique ?')
    expect(r.text).toContain('Licence Informatique')
    expect(r.text).not.toContain('Horizon')
  })

  it('dit « je ne sais pas » hors base', () => {
    const r = answer('Quel est le salaire d’un pilote de ligne ?')
    expect(r.unknown).toBe(true)
    expect(r.text).toMatch(/^Je ne sais pas/)
  })

  it('renvoie vers un conseiller pour une décision sensible', () => {
    expect(answer('Mes parents veulent que je fasse médecine, je dois choisir quoi ?').suggestAdvisor).toBe(true)
  })
})
