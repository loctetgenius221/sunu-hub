import { formationMeta, type Selectivity } from '@/data/formations'
import type { OrientAnswers } from '@/data/orientQuestions'
import { schools } from '@/data/schools'
import type { Program, School } from '@/types'

// Moteur d'orientation V1 par règles (TDR §6.2) :
// score = 35·intérêts + 25·matières + 15·métiers + 15·contraintes + 10·accessibilité.
// Filtres : série admise et établissement vérifié (public ou habilité), toujours ;
// budget et ville aussi, sauf s'il reste moins de trois pistes (on l'indique alors comme un risque).

export const ORIENT_WEIGHTS = { interests: 35, subjects: 25, jobs: 15, constraints: 15, access: 10 }

export type Access = 'accessible' | 'a-tenter' | 'difficile'

export interface Piste {
  program: Program
  school: Pick<School, 'id' | 'name' | 'acronym' | 'city' | 'status' | 'source' | 'verifiedAt'>
  field: string
  campusen: boolean // formation publique : vœu à saisir sur Campusen
  access: Access
  outcomes: string[]
  score: number
  reasons: string[]
  risks: string[]
}

const list = (a: OrientAnswers, k: string) => (Array.isArray(a[k]) ? (a[k] as string[]) : [])
const one = (a: OrientAnswers, k: string) => (typeof a[k] === 'string' ? (a[k] as string) : '')

/** Accessibilité en fourchette, jamais en pourcentage (TDR §6.2). */
export function accessFor(selectivity: Selectivity, mention: string): Access {
  const rank = { inconnue: -1, passable: 0, ab: 1, b: 2, tb: 3 }[mention] ?? -1
  if (selectivity === 'ouverte') return 'accessible'
  if (selectivity === 'moyenne') return rank === 0 ? 'a-tenter' : 'accessible'
  if (rank >= 2) return 'accessible'
  return rank === 0 ? 'difficile' : 'a-tenter'
}

const ACCESS_VALUE: Record<Access, number> = { accessible: 1, 'a-tenter': 0.6, difficile: 0.2 }

function candidates(a: OrientAnswers) {
  const serie = one(a, 'serie')
  return formationMeta.flatMap((meta) => {
    const school = schools.find((s) => s.programs.some((p) => p.id === meta.programId))
    const program = school?.programs.find((p) => p.id === meta.programId)
    if (!school || !program || program.level !== 'licence') return []
    // Jamais d'établissement non habilité ou non vérifié parmi les propositions.
    if (school.status !== 'public' && school.status !== 'habilite') return []
    if (serie && program.admittedSeries.length && !program.admittedSeries.includes(serie)) return []
    return [{ meta, school, program }]
  })
}

type Candidate = ReturnType<typeof candidates>[number]

function evaluate({ meta, school, program }: Candidate, a: OrientAnswers): Piste {
  const reasons: string[] = []
  const risks: string[] = []

  const interests = list(a, 'interests').includes(meta.field) ? 1 : 0
  if (interests) reasons.push('le domaine qui t’attire')

  const liked = meta.subjects.filter((s) => list(a, 'liked').includes(s)).length
  const strong = meta.subjects.filter((s) => list(a, 'strong').includes(s)).length
  const subjects = (0.5 * liked + 0.5 * strong) / meta.subjects.length
  if (strong) reasons.push('tes matières fortes')
  else if (liked) reasons.push('des matières que tu aimes')

  const jobs = meta.jobs.some((j) => list(a, 'jobs').includes(j)) ? 1 : 0
  if (jobs) reasons.push('des métiers qui te font envie')

  const budget = one(a, 'budget')
  const minCost = program.costRange?.[0] ?? 0
  const budgetOk = budget === 'illimite' || !budget || minCost <= Number(budget)
  if (!budgetOk) risks.push('Au-dessus du budget indiqué')

  const cityOk = one(a, 'mobility') === 'oui' || one(a, 'city') === school.city
  if (!cityOk) risks.push(`Formation à ${school.city}, hors de ta ville`)

  const duration = one(a, 'duration')
  const durationOk = !duration || duration === 'inconnue' || Number(duration) === program.durationYears ? 1 : 0.5

  const isPublic = school.status === 'public'
  const sector = one(a, 'sector') === 'public' && !isPublic ? 0.4 : 1
  const constraints = ((budgetOk ? 1 : 0) + (cityOk ? 1 : 0) + durationOk + sector) / 4
  if (budgetOk && cityOk) reasons.push(isPublic ? 'un coût public, accessible' : 'dans ton budget')

  const access = accessFor(meta.selectivity, one(a, 'mention'))
  if (access === 'difficile') risks.push('Sélection forte au vu de la mention visée')
  if (!program.accredited) risks.push('Formation non accréditée')

  const score = Math.round(
    ORIENT_WEIGHTS.interests * interests +
      ORIENT_WEIGHTS.subjects * subjects +
      ORIENT_WEIGHTS.jobs * jobs +
      ORIENT_WEIGHTS.constraints * constraints +
      ORIENT_WEIGHTS.access * ACCESS_VALUE[access],
  )

  const { id, name, acronym, city, status, source, verifiedAt } = school
  return {
    program,
    school: { id, name, acronym, city, status, source, verifiedAt },
    field: meta.field,
    campusen: isPublic,
    access,
    outcomes: meta.outcomes,
    score,
    reasons,
    risks,
  }
}

/** Trois pistes classées et deux pistes élargies, hors du premier réflexe (TDR O4). */
export function recommend(a: OrientAnswers): { top: Piste[]; wide: Piste[] } {
  const all = candidates(a)
    .map((c) => evaluate(c, a))
    .sort((x, y) => y.score - x.score)

  // Budget et ville sont des filtres, tant qu'il reste au moins trois pistes.
  const strict = all.filter((p) => !p.risks.some((r) => r.startsWith('Au-dessus') || r.startsWith('Formation à')))
  const pool = strict.length >= 3 ? strict : all

  const top = pool.slice(0, 3)
  const topFields = new Set(top.map((p) => p.field))
  const interests = list(a, 'interests')
  const rest = pool.filter((p) => !top.includes(p))
  const wide = [
    ...rest.filter((p) => !topFields.has(p.field) && !interests.includes(p.field)),
    ...rest.filter((p) => topFields.has(p.field) || interests.includes(p.field)),
  ].slice(0, 2)

  return { top, wide }
}

export const accessLabels: Record<Access, string> = {
  accessible: 'Accessible',
  'a-tenter': 'À tenter',
  difficile: 'Difficile',
}
