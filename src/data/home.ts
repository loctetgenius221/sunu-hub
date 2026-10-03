import type { Profile, Stage } from '@/types'

// Contenus de la page d'accueil (portail).

export type BuildingId = 'lycee' | 'universite' | 'entreprise' | 'incubateur'

export const buildings: Record<BuildingId, { label: string; offers: string }> = {
  lycee: { label: 'Lycée', offers: 'Orientation et concours' },
  universite: { label: 'Université', offers: 'Formations et bourses' },
  entreprise: { label: 'Entreprise', offers: 'Stages et emplois juniors' },
  incubateur: { label: 'Incubateur', offers: 'Financements et programmes' },
}

/** Le héros demande d'abord « Je suis… » : chaque stade allume un bâtiment du Hub. */
export const stages: { id: Stage; label: string; building: BuildingId; promise: string }[] = [
  {
    id: 'terminale',
    label: 'Élève de Terminale',
    building: 'lycee',
    promise: 'Trois pistes de formation expliquées, et le statut officiel de chaque école.',
  },
  {
    id: 'bachelier',
    label: 'Nouveau bachelier',
    building: 'universite',
    promise: 'Ta liste de vœux Campusen classée, avec un plan B et les rappels de dates.',
  },
  {
    id: 'etudiant',
    label: 'Étudiant',
    building: 'entreprise',
    promise: 'Les stages, bourses et concours ouverts pour ta filière, triés par pertinence.',
  },
  {
    id: 'diplome',
    label: 'Jeune diplômé',
    building: 'incubateur',
    promise: 'Premiers emplois, formations et financements, avec une alerte avant chaque date limite.',
  },
]

export const doors = {
  orienter: {
    title: 'Orienter',
    lead: 'Pour choisir sa voie après le bac, ou se réorienter.',
    points: [
      'Trois pistes expliquées selon ton profil',
      "Le statut officiel de chaque école, avec la source",
      'Ta liste de vœux Campusen, prête à saisir',
      'Un résumé à montrer à ta famille',
    ],
    cta: { label: 'Commencer le questionnaire', to: '/orienter' },
  },
  opportunites: {
    title: 'Opportunités',
    lead: 'Pour trouver un stage, une bourse, un concours ou un premier emploi.',
    points: [
      'Un fil trié selon ton niveau et ta filière',
      'Chaque offre vérifiée, avec son lien d’origine',
      'Un rappel sept jours et un jour avant la date limite',
      'Le suivi de tes candidatures au même endroit',
    ],
    cta: { label: 'Voir les opportunités', to: '/opportunites' },
  },
}

/** Profil d'exemple pour l'aperçu du fil sur l'accueil. */
export const demoProfile: Profile = {
  phone: '',
  firstName: 'Awa',
  stage: 'etudiant',
  level: 'licence',
  field: 'informatique',
  city: 'Dakar',
  goal: 'stage',
}

export const alerts = [
  { time: '09:12', text: 'Nouveau : Stage développeur web chez Teranga Digital. Score 100/100, à Dakar.' },
  { time: '18:40', text: 'Rappel : la formation en marketing digital ferme dans 7 jours.' },
  { time: '08:05', text: 'Dernier jour pour le concours d’entrée en école de commerce.' },
]

export const structuresPitch = {
  title: 'Publiez vos opportunités, gratuitement.',
  lead: 'Écoles, entreprises, ONG et incubateurs : un formulaire court, un compte vérifié, et vos offres arrivent aux jeunes dont le profil correspond.',
  points: [
    'Le nombre de profils correspondants, visible avant de publier',
    'Les candidatures classées par adéquation',
    'Un badge « vérifiée » pour votre structure',
  ],
  matching: { count: 1248, filters: ['Licence', 'Informatique', 'Dakar'] },
}

/** Règles de neutralité du TDR (§5.2), écrites dans les conditions d'utilisation. */
export const commitments = [
  'Le classement des recommandations et des opportunités ne dépend jamais d’un paiement.',
  'Seuls les établissements habilités peuvent acheter une mise en avant.',
  'Tout contenu sponsorisé est étiqueté comme tel.',
  'Tu n’es contacté que si tu l’as demandé ou accepté.',
  'Toute offre qui demande de l’argent au candidat est refusée.',
]
