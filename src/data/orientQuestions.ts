import { fields, cities, type Option } from './questions'

// Questionnaire d'orientation approfondi (TDR O3) : 15 questions, environ 8 minutes.
// `max` limite le nombre de choix pour les questions à choix multiples.

export interface OrientQuestion {
  id: string
  title: string
  hint?: string
  options: Option[]
  multiple?: boolean
  max?: number
}

export const subjects: Option[] = [
  { value: 'maths', label: 'Mathématiques' },
  { value: 'physique', label: 'Physique-chimie' },
  { value: 'svt', label: 'SVT' },
  { value: 'francais', label: 'Français' },
  { value: 'philo', label: 'Philosophie' },
  { value: 'anglais', label: 'Anglais' },
  { value: 'histoire', label: 'Histoire-géographie' },
  { value: 'economie', label: 'Économie' },
]

export const jobs: Option[] = [
  { value: 'developpeur', label: 'Développeur' },
  { value: 'ingenieur', label: 'Ingénieur' },
  { value: 'soignant', label: 'Infirmier, médecin' },
  { value: 'comptable', label: 'Comptable, financier' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'journaliste', label: 'Journaliste' },
  { value: 'avocat', label: 'Juriste, avocat' },
  { value: 'agronome', label: 'Agronome' },
  { value: 'enseignant', label: 'Enseignant' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
]

export const mentions: Option[] = [
  { value: 'inconnue', label: 'Je ne sais pas encore' },
  { value: 'passable', label: 'Passable' },
  { value: 'ab', label: 'Assez bien' },
  { value: 'b', label: 'Bien' },
  { value: 'tb', label: 'Très bien' },
]

export const orientQuestions: OrientQuestion[] = [
  { id: 'serie', title: 'Ta série au bac ?', options: ['L1', 'L2', 'S1', 'S2', 'S3', 'G', 'T'].map((s) => ({ value: s, label: `Série ${s}` })) },
  { id: 'mention', title: 'Quelle mention vises-tu, ou as-tu obtenue ?', hint: 'Elle sert à estimer tes chances, jamais à te fermer une porte.', options: mentions },
  { id: 'interests', title: 'Qu’est-ce qui t’attire le plus ?', hint: 'Trois choix au plus.', options: fields, multiple: true, max: 3 },
  { id: 'liked', title: 'Les matières que tu aimes ?', options: subjects, multiple: true, max: 4 },
  { id: 'strong', title: 'Les matières où tu as tes meilleures notes ?', options: subjects, multiple: true, max: 4 },
  { id: 'jobs', title: 'Des métiers qui te font envie ?', hint: 'Trois choix au plus.', options: jobs, multiple: true, max: 3 },
  {
    id: 'team',
    title: 'Tu préfères travailler…',
    options: [
      { value: 'seul', label: 'Plutôt seul' },
      { value: 'equipe', label: 'En équipe' },
      { value: 'egal', label: 'Les deux me vont' },
    ],
  },
  {
    id: 'place',
    title: 'Plutôt dans un bureau ou sur le terrain ?',
    options: [
      { value: 'bureau', label: 'Au bureau' },
      { value: 'terrain', label: 'Sur le terrain' },
      { value: 'egal', label: 'Les deux' },
    ],
  },
  {
    id: 'duration',
    title: 'Combien d’années d’études envisages-tu ?',
    options: [
      { value: '2', label: 'Deux ans' },
      { value: '3', label: 'Trois ans' },
      { value: '5', label: 'Cinq ans ou plus' },
      { value: 'inconnue', label: 'Je ne sais pas' },
    ],
  },
  {
    id: 'budget',
    title: 'Quel budget par an ta famille peut-elle prévoir ?',
    hint: 'Frais de scolarité seulement.',
    options: [
      { value: '100000', label: 'Moins de 100 000 FCFA' },
      { value: '500000', label: 'Jusqu’à 500 000 FCFA' },
      { value: '1000000', label: 'Jusqu’à 1 000 000 FCFA' },
      { value: 'illimite', label: 'Plus de 1 000 000 FCFA' },
    ],
  },
  { id: 'city', title: 'Où habites-tu ?', options: cities },
  {
    id: 'mobility',
    title: 'Peux-tu étudier dans une autre ville ?',
    options: [
      { value: 'non', label: 'Non, je reste dans ma ville' },
      { value: 'oui', label: 'Oui, partout au Sénégal' },
    ],
  },
  {
    id: 'sector',
    title: 'Public ou privé ?',
    options: [
      { value: 'public', label: 'Public de préférence' },
      { value: 'egal', label: 'Peu importe' },
    ],
  },
  {
    id: 'priority',
    title: 'Ta priorité après tes études ?',
    options: [
      { value: 'emploi', label: 'Trouver vite un emploi' },
      { value: 'etudes', label: 'Aller loin dans les études' },
      { value: 'entreprendre', label: 'Créer mon entreprise' },
      { value: 'inconnue', label: 'Je ne sais pas encore' },
    ],
  },
  {
    id: 'family',
    title: 'Ta famille a-t-elle déjà une idée pour toi ?',
    hint: 'Nous en tiendrons compte dans le résumé à leur montrer.',
    options: [
      { value: 'forte', label: 'Oui, une idée précise' },
      { value: 'un-peu', label: 'Un peu' },
      { value: 'non', label: 'Non, c’est mon choix' },
    ],
  },
]

export type OrientAnswers = Record<string, string | string[]>
