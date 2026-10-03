import type { VerificationStatus } from '@/types'

// Décisions de l'équipe sur les opportunités (TDR A1), conservées sur l'appareil en maquette.
// L'API les appliquera côté serveur ; ici `api.ts` les lit pour filtrer et étiqueter les offres.

const KEY = 'sunu-hub:curation'

export interface Curation {
  status: Record<string, VerificationStatus>
  hidden: string[]
  log: { at: string; action: string }[] // journal de toute modification (TDR A2)
}

export function readCuration(): Curation {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { status: {}, hidden: [], log: [], ...JSON.parse(raw) } : { status: {}, hidden: [], log: [] }
  } catch {
    return { status: {}, hidden: [], log: [] }
  }
}

export function writeCuration(c: Curation, action: string) {
  c.log.unshift({ at: new Date().toISOString(), action })
  c.log = c.log.slice(0, 50)
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {
    /* stockage indisponible */
  }
}
