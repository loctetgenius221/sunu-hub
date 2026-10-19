// Contenu éditorial du portail. Aucun texte en dur dans les composants.

export const nav = [
  { label: 'Opportunités', to: '/opportunites' },
  { label: 'Orienter', to: '/orienter' },
  { label: 'Vérifier une école', to: '/verifier-ecole' },
  { label: 'Structures', to: '/structures' },
]

export const tagline = 'La plateforme intelligente qui accompagne, connecte et valorise la jeunesse sénégalaise.'

// Réseaux sociaux, par ordre d'usage chez les 15-30 ans au Sénégal.
// ADRESSES À CONFIRMER : comptes à créer ou à vérifier avant la mise en ligne
// (les reporter aussi dans « sameAs » des données structurées, index.html).
export type SocialId = 'facebook' | 'tiktok' | 'instagram' | 'linkedin' | 'youtube' | 'x'
export const socials: { id: SocialId; label: string; url: string }[] = [
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/sunuhub' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@sunuhub' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/sunuhub' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/sunuhub' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@sunuhub' },
  { id: 'x', label: 'X', url: 'https://x.com/sunuhub' },
]

// WhatsApp : numéro au format international sans « + » (ex. 221771234567), dans .env.
// Sans numéro, le lien ouvre WhatsApp avec le message prêt, sans destinataire.
export const whatsapp = {
  number: import.meta.env.VITE_WHATSAPP_NUMBER ?? '',
  message: 'Bonjour SUNU HŪB, j’ai une question.',
}
export const whatsappUrl = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`
