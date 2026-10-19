// Contenus de la page « Espace structures ».

/** `icon` : nom d'icône lucide, résolu par la vue. */
export const howItWorks: { title: string; text: string; delay: string; icon: 'shield' | 'file' | 'inbox' }[] = [
  {
    title: 'Créer un compte vérifié',
    text: 'Un e-mail professionnel ou votre NINEA. Notre équipe valide le compte à la main.',
    delay: 'Sous 48 h ouvrées',
    icon: 'shield',
  },
  {
    title: 'Publier une opportunité',
    text: 'Un formulaire court. Vous voyez combien de jeunes correspondent avant de publier.',
    delay: 'Environ 3 minutes',
    icon: 'file',
  },
  {
    title: 'Recevoir des candidatures classées',
    text: 'Les candidats sont triés du plus au moins adapté. Le jeune voit la réponse que vous lui donnez.',
    delay: 'Dès la mise en ligne',
    icon: 'inbox',
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
