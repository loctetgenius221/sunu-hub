import { describe, expect, it } from 'vitest'
import { estimateAudience, paymentTerms, suspectTerms } from '../moderation'

describe('paymentTerms', () => {
  it('repère une demande d’argent, accents et majuscules compris', () => {
    expect(paymentTerms('Frais de dossier : 10 000 FCFA à VERSER par Wave')).toEqual(['frais de dossier', 'verser'])
    expect(suspectTerms('Frais de dossier : 10 000 FCFA à verser par Wave')).toEqual(['wave'])
  })

  it('laisse passer une offre normale', () => {
    expect(paymentTerms('Stage rémunéré de 3 mois, indemnité mensuelle')).toEqual([])
  })

  it('ne bloque pas un mot ambigu, mais le signale', () => {
    const text = 'CDD pour une application de paiement mobile'
    expect(paymentTerms(text)).toEqual([])
    expect(suspectTerms(text)).toEqual(['paiement'])
  })
})

describe('estimateAudience', () => {
  it('vaut 0 sans niveau ou sans filière', () => {
    expect(estimateAudience({ levels: [], fields: ['gestion'], city: 'Dakar', remote: false })).toBe(0)
  })

  it('augmente quand l’offre est ouverte à distance', () => {
    const base = { levels: ['licence' as const], fields: ['informatique'], city: 'Dakar' }
    expect(estimateAudience({ ...base, remote: true })).toBeGreaterThan(estimateAudience({ ...base, remote: false }))
  })
})
