import { formationMeta } from '@/data/formations'
import { officialStatuses } from '@/data/schoolGuide'
import { fields } from '@/data/questions'
import { schoolStatus } from '@/data/labels'
import { schools } from '@/data/schools'
import { normalize } from './filters'

// Assistant d'orientation simulé (TDR O6). Il ne répond qu'à partir de la base vérifiée,
// cite la source et la date, dit « je ne sais pas » hors base et renvoie vers un conseiller
// pour les décisions sensibles. La version réelle passera par un modèle de langage avec les mêmes règles.

export interface AssistantReply {
  text: string
  sources: { label: string; date?: string }[]
  unknown?: boolean
  suggestAdvisor?: boolean
}

const fcfa = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`
const date = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const SENSITIVE = ['je dois choisir', 'mes parents', 'ma famille', 'je ne sais pas quoi faire', 'que dois-je', 'tu me conseilles', 'quelle filiere choisir']

export function answer(question: string): AssistantReply {
  const q = normalize(question)
  const sensitive = SENSITIVE.some((s) => q.includes(normalize(s)))

  // 1. Un établissement cité par son nom ou son sigle.
  const school = schools.find((s) => q.includes(normalize(s.name)) || (s.acronym && new RegExp(`\\b${normalize(s.acronym)}\\b`).test(q)))
  if (school) {
    const st = schoolStatus[school.status]
    const programs = school.programs.map((p) => `${p.name} (${p.accredited ? 'accréditée' : 'non accréditée'}${p.cames ? ', CAMES' : ''})`)
    return {
      text: `${school.name} : ${st.label.toLowerCase()}. ${st.explain}${programs.length ? ` Formations vérifiées : ${programs.join(' ; ')}.` : ''}`,
      sources: [{ label: school.source, date: date(school.verifiedAt) }],
      suggestAdvisor: sensitive,
    }
  }

  // 2. Un statut officiel (agrément, habilitation, accréditation, CAMES).
  const status = officialStatuses.find((s) => q.includes(normalize(s.term).split(' ').pop()!.slice(0, 7)))
  if (status) {
    return { text: `${status.term} (${status.who.toLowerCase()}) : ${status.meaning}`, sources: [{ label: 'Guide SUNU HŪB des statuts, d’après l’ANAQ-Sup' }], suggestAdvisor: sensitive }
  }

  // 3. Campusen : calendrier et règles.
  if (q.includes('campusen') || q.includes('voeu')) {
    return {
      text: 'Campusen collecte les choix des bacheliers pour les universités et instituts publics, dans un ordre obligatoire. En 2026, la plateforme était ouverte du 17 août au 13 septembre ; les dates 2027 ne sont pas encore publiées. SUNU HŪB t’aide à préparer ta liste, mais tu la saisis toi-même : personne ne doit le faire à ta place.',
      sources: [{ label: 'Le Soleil, « Campusen ouvre le 17 août »', date: '2026' }],
      suggestAdvisor: sensitive,
    }
  }

  // 4. Un domaine d'études : formations de la base, coût et sélectivité.
  const field = fields.find((f) => q.includes(f.value) || normalize(f.label).split(/[ ,]+/).some((w) => w.length > 4 && q.includes(w)))
  if (field) {
    const items = formationMeta
      .filter((m) => m.field === field.value)
      .flatMap((m) => {
        const s = schools.find((x) => x.programs.some((p) => p.id === m.programId))
        const p = s?.programs.find((x) => x.id === m.programId)
        if (!s || !p || (s.status !== 'public' && s.status !== 'habilite')) return []
        return [{ s, p, m }]
      })
    if (items.length) {
      return {
        text: `Dans notre base, en ${field.label.toLowerCase()} : ${items
          .map(({ s, p, m }) => `${p.name} à ${s.name} (${s.city}, ${p.costRange ? `${fcfa(p.costRange[0])} à ${fcfa(p.costRange[1])} par an` : 'coût non communiqué'}, sélection ${m.selectivity})`)
          .join(' ; ')}. Les débouchés que nous affichons sont des estimations.`,
        sources: items.map(({ s }) => ({ label: s.source, date: date(s.verifiedAt) })),
        suggestAdvisor: sensitive,
      }
    }
  }

  return {
    text: sensitive
      ? 'C’est une décision importante : je préfère que tu en parles avec un conseiller d’orientation. Il te répond sous 48 heures.'
      : 'Je ne sais pas : cette information n’est pas dans notre base vérifiée. Consulte une source officielle ou demande à un conseiller.',
    sources: [],
    unknown: true,
    suggestAdvisor: true,
  }
}

export const assistantExamples = [
  'L’ICVM est-elle reconnue ?',
  'Que veut dire habilitation ?',
  'Quelles formations en informatique ?',
  'Quand ouvre Campusen ?',
]
