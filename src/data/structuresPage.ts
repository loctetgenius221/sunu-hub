import type { SceneKind } from '@/components/art/scenes'

// Contenus de la page « Espace structures ».

export const howItWorks: { title: string; text: string; delay: string; art: SceneKind }[] = [
  {
    title: 'Créer un compte vérifié',
    text: 'Un e-mail professionnel ou votre NINEA. Notre équipe valide le compte à la main.',
    delay: 'Sous 48 h ouvrées',
    art: 'shield',
  },
  {
    title: 'Publier une opportunité',
    text: 'Un formulaire court. Vous voyez combien de jeunes correspondent avant de publier.',
    delay: 'Environ 3 minutes',
    art: 'sheets',
  },
  {
    title: 'Recevoir des candidatures classées',
    text: 'Les candidats sont triés par adéquation. Le statut que vous indiquez est visible par le jeune.',
    delay: 'Dès la mise en ligne',
    art: 'network',
  },
]

export const freeNow = [
  'Publication de stages, emplois juniors, bourses, concours, formations et événements',
  'Diffusion ciblée vers les profils qui correspondent',
  'Tableau des candidatures classées, export CSV',
  'Badge « vérifiée » pour votre structure',
]

export const later = [
  'Recherche avancée de profils',
  'Short-lists sur demande',
  'Mise en avant, toujours étiquetée « sponsorisé »',
]
