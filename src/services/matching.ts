import type { Opportunity, Profile, Structure, ScoredOpportunity } from '@/types'

// Moteur V1 par règles (TDR §6.2) :
// score = 30·filière + 25·niveau + 15·type + 15·lieu + 15·disponibilité, chaque terme entre 0 et 1.
export const WEIGHTS = { field: 30, level: 25, type: 15, place: 15, availability: 15 }

const DAY = 86_400_000

export function daysLeft(deadline: string, now = new Date()): number {
  return Math.ceil((new Date(deadline).getTime() - now.getTime()) / DAY)
}

export function scoreOpportunity(
  o: Opportunity,
  structure: Structure,
  p: Profile,
  now = new Date(),
): ScoredOpportunity {
  const reasons: string[] = []

  const field = o.fields.includes(p.field) ? 1 : 0
  if (field) reasons.push('correspond à ta filière')

  const level = o.levels.includes(p.level) ? 1 : o.levels.includes('tous') ? 0.6 : 0
  if (level === 1) reasons.push('adaptée à ton niveau')

  const type = o.type === p.goal ? 1 : 0.3
  if (type === 1) reasons.push('le type que tu cherches')

  const place = o.remote || o.city === p.city ? 1 : 0.3
  if (place === 1) reasons.push(o.remote ? 'accessible à distance' : `à ${o.city}`)

  const left = daysLeft(o.deadline, now)
  const availability = left < 0 ? 0 : left < 3 ? 0.4 : 1

  const score = Math.round(
    WEIGHTS.field * field +
      WEIGHTS.level * level +
      WEIGHTS.type * type +
      WEIGHTS.place * place +
      WEIGHTS.availability * availability,
  )

  return { ...o, structure, score, reasons }
}

/** Rappels avant date limite pour une offre sauvegardée (TDR Q4) : J-7 et J-1, sauf s'ils sont passés. */
export function reminders(deadline: string, now = new Date()): { label: string; date: Date }[] {
  const end = new Date(deadline).getTime()
  return [
    { label: 'J-7', date: new Date(end - 7 * DAY) },
    { label: 'J-1', date: new Date(end - DAY) },
  ].filter((r) => r.date.getTime() > now.getTime())
}
