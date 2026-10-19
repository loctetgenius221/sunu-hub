import type { Profile, Stage } from '@/types'

// Contenus de la page d'accueil (portail).

/** Le héros demande d'abord « Je suis… » : la promesse s'adapte au stade. */
export const stages: { id: Stage; label: string; promise: string }[] = [
  {
    id: 'terminale',
    label: 'Élève de Terminale',
    promise: 'Trois pistes de formation expliquées, et le statut officiel de chaque école.',
  },
  {
    id: 'bachelier',
    label: 'Nouveau bachelier',
    promise: 'Ta liste de vœux Campusen classée, avec un plan B et les rappels de dates.',
  },
  {
    id: 'etudiant',
    label: 'Étudiant',
    promise: 'Les stages, bourses et concours ouverts pour ta filière, triés par pertinence.',
  },
  {
    id: 'diplome',
    label: 'Jeune diplômé',
    promise: 'Premiers emplois, formations et financements, avec une alerte avant chaque date limite.',
  },
]

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

/** Étapes de « Comment ça marche » : une vraie séquence, d'où la numérotation. */
export const howItWorks = [
  {
    id: 'profil',
    title: 'Ton numéro, cinq questions.',
    text: 'Pas d’e-mail ni de mot de passe : ton numéro de téléphone suffit. Cinq questions, et ton profil est prêt.',
  },
  {
    id: 'fil',
    title: 'Ton fil se remplit.',
    text: 'Stages, bourses, concours et formations, triés selon ton niveau et ta filière. Chaque offre dit pourquoi elle est là.',
  },
  {
    id: 'alerte',
    title: 'On te prévient sur WhatsApp.',
    text: 'Une alerte quand une offre te correspond, un rappel avant chaque date limite. Trois messages par semaine au plus.',
  },
  {
    id: 'suivi',
    title: 'Tu suis tes candidatures.',
    text: 'Envoyée, entretien, réponse : tout est au même endroit, et la structure peut te répondre ici.',
  },
] as const

export type HowStep = (typeof howItWorks)[number]['id']

/** Chiffres de contexte (TDR §1 et §2.1), sourcés. */
export const keyFigures = [
  { value: '286 169', label: 'étudiants au Sénégal en 2024, dans le public et le privé', source: 'Le Soleil' },
  { value: '75 000', label: 'nouveaux bacheliers à orienter chaque année, environ', source: 'Le Soleil, Campusen 2025' },
  { value: '0 FCFA', label: 'pour les jeunes, sans exception', source: 'Engagement SUNU HŪB' },
]
