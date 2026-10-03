import { normalize } from './filters'
import type { Level } from '@/types'

// Contrôles côté structure (TDR §5.2 et §7).

// Demandes d'argent explicites : une offre qui fait payer le candidat est refusée.
const BLOCKING_TERMS = [
  'frais de dossier',
  "frais d'inscription",
  'frais de formation',
  'frais de candidature',
  'caution',
  'payer',
  'verser',
  'versement',
]

// Mots ambigus (« application de paiement mobile » est légitime) : ils ne bloquent pas,
// mais l'offre est signalée à l'équipe pour relecture.
const SUSPECT_TERMS = ['paiement', 'mobile money', 'orange money', 'wave']

const find = (terms: string[], text: string) => {
  const t = normalize(text)
  return terms.filter((term) => new RegExp(`\\b${normalize(term)}\\b`).test(t))
}

/** Termes qui font refuser l'offre (liste vide si acceptable). */
export const paymentTerms = (text: string) => find(BLOCKING_TERMS, text)

/** Termes à faire vérifier par l'équipe, sans bloquer la publication. */
export const suspectTerms = (text: string) => find(SUSPECT_TERMS, text)

// Estimation du nombre de profils correspondants avant publication (maquette : base fictive).
const BASE = 20000
const LEVEL_SHARE: Record<Level, number> = { bac: 0.35, licence: 0.45, master: 0.2, tous: 1 }
const FIELD_SHARE = 0.12
const CITY_SHARE: Record<string, number> = { Dakar: 0.45, Thiès: 0.1, 'Saint-Louis': 0.08, Kaolack: 0.07, Ziguinchor: 0.06, Touba: 0.06, Mbour: 0.05 }

export function estimateAudience(o: { levels: Level[]; fields: string[]; city: string; remote: boolean }): number {
  if (!o.levels.length || !o.fields.length) return 0
  const level = Math.min(1, o.levels.reduce((n, l) => n + LEVEL_SHARE[l], 0))
  const field = Math.min(1, o.fields.length * FIELD_SHARE)
  const city = o.remote ? 1 : (CITY_SHARE[o.city] ?? 0.04)
  return Math.round(BASE * level * field * city)
}
