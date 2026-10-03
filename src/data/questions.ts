import type { EntryAnswers, Level } from '@/types'

// Questionnaire d'entrée (TDR P2) : 5 questions qui détectent le stade et ouvrent la bonne porte.
// Les options des questions 2, 3 et 5 dépendent du stade choisi.

export interface Option {
  value: string
  label: string
}

export interface Question {
  id: keyof EntryAnswers
  title: (a: EntryAnswers) => string
  options: (a: EntryAnswers) => Option[]
}

const atSchool = (a: EntryAnswers) => a.stage === 'terminale' || a.stage === 'bachelier'

export const fields: Option[] = [
  { value: 'informatique', label: 'Informatique et numérique' },
  { value: 'gestion', label: 'Gestion et commerce' },
  { value: 'communication', label: 'Communication et médias' },
  { value: 'sciences', label: 'Sciences et ingénierie' },
  { value: 'sante', label: 'Santé' },
  { value: 'agriculture', label: 'Agriculture et environnement' },
  { value: 'droit', label: 'Droit et sciences politiques' },
  { value: 'lettres', label: 'Lettres, langues et sciences humaines' },
]

export const cities = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Touba', 'Mbour', 'Autre ville'].map(
  (c) => ({ value: c, label: c }),
)

export const questions: Question[] = [
  {
    id: 'stage',
    title: () => 'Où en es-tu aujourd’hui ?',
    options: () => [
      { value: 'terminale', label: 'En Terminale' },
      { value: 'bachelier', label: 'Je viens d’avoir le bac' },
      { value: 'etudiant', label: 'Étudiant' },
      { value: 'diplome', label: 'Jeune diplômé' },
    ],
  },
  {
    id: 'track',
    title: (a) => (atSchool(a) ? 'Ta série ?' : a.stage === 'diplome' ? 'Ton dernier diplôme ?' : 'Ton année d’études ?'),
    options: (a) =>
      atSchool(a)
        ? ['L1', 'L2', 'S1', 'S2', 'S3', 'G', 'T'].map((s) => ({ value: s, label: `Série ${s}` }))
        : a.stage === 'diplome'
          ? [
              { value: 'Licence', label: 'Licence' },
              { value: 'Master', label: 'Master' },
              { value: 'BTS', label: 'BTS ou DUT' },
            ]
          : ['L1', 'L2', 'L3', 'M1', 'M2'].map((s) => ({ value: s, label: s })),
  },
  {
    id: 'field',
    title: (a) => (atSchool(a) ? 'Quel domaine t’attire ?' : 'Ta filière ?'),
    options: () => fields,
  },
  {
    id: 'city',
    title: () => 'Où habites-tu ?',
    options: () => cities,
  },
  {
    id: 'goal',
    title: () => 'Que cherches-tu en priorité ?',
    options: (a) =>
      atSchool(a)
        ? [
            { value: 'orientation', label: 'M’orienter' },
            { value: 'concours', label: 'Des concours' },
            { value: 'bourse', label: 'Une bourse' },
            { value: 'formation', label: 'Une formation' },
          ]
        : [
            { value: 'stage', label: 'Un stage' },
            { value: 'emploi', label: 'Un premier emploi' },
            { value: 'bourse', label: 'Une bourse' },
            { value: 'concours', label: 'Un concours' },
            { value: 'formation', label: 'Une formation' },
            { value: 'financement', label: 'Un financement' },
          ],
  },
]

/** Niveau utilisé par le moteur à partir de la série ou de l'année d'études. */
export function levelFromTrack(a: EntryAnswers): Level {
  if (atSchool(a)) return 'bac'
  return a.track?.startsWith('M') || a.track === 'Master' ? 'master' : 'licence'
}

export const labelOf = (q: Question, a: EntryAnswers) =>
  q.options(a).find((o) => o.value === a[q.id])?.label ?? '—'
