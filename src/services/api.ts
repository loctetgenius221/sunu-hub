import { opportunities } from '@/data/opportunities'
import { schools } from '@/data/schools'
import { structures } from '@/data/structures'
import type { Opportunity, Profile, School, ScoredOpportunity, Structure, VerificationStatus } from '@/types'
import { readCuration, writeCuration } from './curation'
import { normalize } from './filters'
import { daysLeft, scoreOpportunity } from './matching'

// Couche d'accès aux données. Elle lit les mocks aujourd'hui ;
// seules ces fonctions changeront quand l'API Node/PostgreSQL existera.

const latency = <T>(value: T, ms = 250) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms))

const structureOf = (id: string): Structure => {
  const s = structures.find((x) => x.id === id)
  if (!s) throw new Error(`Structure inconnue : ${id}`)
  return s
}

// Signalements reçus côté serveur (simulés). Une offre est masquée à partir de 3 (TDR Q6).
export const REPORT_LIMIT = 3
const reports: Record<string, number> = { o5: 2 }

// Décisions de l'équipe (statut de vérification, masquage) appliquées par-dessus les données.
const curated = (o: Opportunity): Opportunity => ({ ...o, status: readCuration().status[o.id] ?? o.status })
const visible = (o: Opportunity) =>
  daysLeft(o.deadline) >= 0 && (reports[o.id] ?? 0) < REPORT_LIMIT && !readCuration().hidden.includes(o.id)

export function listOpportunities(): Promise<Opportunity[]> {
  return latency(opportunities.filter(visible).map(curated))
}

export function getOpportunity(id: string): Promise<(Opportunity & { structure: Structure; hidden: boolean }) | null> {
  const o = opportunities.find((x) => x.id === id)
  return latency(o ? { ...curated(o), structure: structureOf(o.structureId), hidden: !visible(o) } : null)
}

// --- Back-office (TDR A1) ---

export interface CurationRow extends Opportunity {
  structure: Structure
  reports: number
  hidden: boolean
  expired: boolean
}

export function listForCuration(): Promise<CurationRow[]> {
  const hidden = readCuration().hidden
  return latency(
    opportunities.map((o) => ({
      ...curated(o),
      structure: structureOf(o.structureId),
      reports: reports[o.id] ?? 0,
      hidden: hidden.includes(o.id) || (reports[o.id] ?? 0) >= REPORT_LIMIT,
      expired: daysLeft(o.deadline) < 0,
    })),
    150,
  )
}

export function setVerification(id: string, status: VerificationStatus) {
  const c = readCuration()
  c.status[id] = status
  writeCuration(c, `Offre ${id} : statut « ${status} »`)
}

export function setHidden(id: string, hidden: boolean) {
  const c = readCuration()
  c.hidden = hidden ? [...new Set([...c.hidden, id])] : c.hidden.filter((x) => x !== id)
  // Remettre en ligne après vérification remet aussi les signalements à zéro.
  if (!hidden) reports[id] = 0
  writeCuration(c, `Offre ${id} : ${hidden ? 'masquée' : 'remise en ligne'}`)
}

/**
 * Fil : opportunités ouvertes avec leur structure. Avec un profil, chacune reçoit un score
 * et le fil est trié par pertinence ; sans profil, score à -1 et tri par date limite.
 */
export async function getFeed(profile: Profile | null): Promise<ScoredOpportunity[]> {
  const open = await listOpportunities()
  if (!profile) {
    return open
      .map((o) => ({ ...o, structure: structureOf(o.structureId), score: -1, reasons: [] }))
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
  }
  return open.map((o) => scoreOpportunity(o, structureOf(o.structureId), profile)).sort((a, b) => b.score - a.score)
}

/** Renvoie le nombre de signalements après celui-ci. */
export function reportOpportunity(id: string, reason: string): Promise<number> {
  void reason
  reports[id] = (reports[id] ?? 0) + 1
  return latency(reports[id], 400)
}

/** Retour « pertinent / pas pertinent » (TDR Q7), conservé pour la V2 du moteur. */
export function sendFeedback(id: string, useful: boolean): Promise<void> {
  void id, void useful
  return latency(undefined, 150)
}

// Authentification par numéro de téléphone (TDR P1). Maquette : le code est toujours 123456.
export const DEMO_CODE = '123456'

export function requestCode(phone: string, channel: 'whatsapp' | 'sms'): Promise<{ sentTo: string; channel: string }> {
  return latency({ sentTo: phone, channel }, 600)
}

export async function verifyCode(code: string): Promise<boolean> {
  return latency(code === DEMO_CODE, 500)
}

/** Vérificateur d'école (TDR O1) : par nom ou sigle, sans tenir compte des accents. */
export function searchSchools(query: string): Promise<School[]> {
  const q = normalize(query.trim())
  if (!q) return latency([])
  return latency(schools.filter((s) => normalize(`${s.name} ${s.acronym ?? ''}`).includes(q)), 200)
}

export function getSchool(id: string): Promise<School | null> {
  return latency(schools.find((s) => s.id === id) ?? null)
}

/** Demande de vérification d'un établissement absent de la base. */
export function requestSchoolCheck(name: string, city: string): Promise<void> {
  void name, void city
  return latency(undefined, 400)
}
