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
    promise: 'Les stages, bourses et concours ouverts pour ta filière, triés selon ton profil.',
  },
  {
    id: 'diplome',
    label: 'Jeune diplômé',
    promise: 'Premiers emplois, formations et financements, avec une alerte avant chaque date limite.',
  },
]

/**
 * Réseau du héros : « Toi » au centre, relié à tout ce que la plateforme peut t'apporter.
 * `angle` en degrés, sens horaire depuis le haut. `for` : les stades pour lesquels le nœud
 * s'allume quand on choisit « Je suis… ».
 */
export const hubNodes: { id: string; label: string; angle: number; for: Stage[] }[] = [
  { id: 'stage', label: 'Stage', angle: -38, for: ['etudiant', 'diplome'] },
  { id: 'emploi', label: 'Emploi', angle: 28, for: ['diplome'] },
  { id: 'concours', label: 'Concours', angle: 76, for: ['terminale', 'bachelier', 'etudiant'] },
  { id: 'financement', label: 'Financement', angle: 122, for: ['etudiant', 'diplome'] },
  { id: 'incubateur', label: 'Incubateur', angle: 172, for: ['diplome'] },
  { id: 'universite', label: 'Université', angle: 218, for: ['terminale', 'bachelier'] },
  { id: 'ong', label: 'ONG', angle: 262, for: ['etudiant', 'diplome'] },
  { id: 'formation', label: 'Formation', angle: 298, for: ['terminale', 'bachelier', 'etudiant', 'diplome'] },
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
  { time: '09:12', text: 'Nouveau : stage de développeur web chez Teranga Digital, à Dakar. Il correspond à ton profil.' },
  { time: '18:40', text: 'Rappel : la formation en marketing digital ferme dans 7 jours.' },
  { time: '08:05', text: 'Dernier jour pour le concours d’entrée en école de commerce.' },
]

/**
 * Section « deux publics » de l'accueil. Le premier ou le second mot du titre est mis en valeur.
 * Côté structures : « Ne triez plus » plutôt que « Ne publiez plus » (publier reste l'action
 * proposée) ; et pas de recherche directe de profils, contraire à la charte : un jeune n'est
 * contacté que s'il l'a demandé ou accepté.
 */
export const audiences = {
  youth: {
    eyebrow: 'Pour les jeunes',
    title: ['Gratuit.', 'Pour toujours.'],
    lead: 'Un seul profil qui grandit avec toi, du bac jusqu’à ton premier emploi ou ta propre entreprise.',
    proof: 'opportunités ouvertes en ce moment, chacune avec sa source et sa date limite.',
  },
  orgs: {
    eyebrow: 'Pour les structures',
    title: ['Ne triez plus.', 'Trouvez.'],
    lead: 'Votre offre arrive directement aux jeunes dont le profil correspond, au lieu de centaines de candidatures à trier.',
    proof: { count: 1248, label: 'jeunes correspondent à un stage en informatique à Dakar. Vous le savez avant de publier.' },
  },
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
    text: 'Envoyée, entretien, réponse : chaque candidature se suit au même endroit, jusqu’à la réponse de la structure.',
  },
] as const

export type HowStep = (typeof howItWorks)[number]['id']

/** Chiffres de contexte (TDR §1 et §2.1), sourcés. */
export const keyFigures = [
  { value: '286 169', label: 'étudiants au Sénégal en 2024, dans le public et le privé', source: 'Le Soleil' },
  { value: '75 000', label: 'nouveaux bacheliers à orienter chaque année, en moyenne', source: 'Le Soleil, Campusen 2025' },
  { value: '0 FCFA', label: 'pour les jeunes, sans exception', source: 'Engagement SUNU HŪB' },
]
