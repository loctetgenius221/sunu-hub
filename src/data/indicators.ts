// Indicateurs du MVP (TDR §9) : cibles de fin septembre 2027 et seuils d'alerte.
// Valeurs fictives (maquette) ; elles viendront du tableau de bord quotidien.

export interface Indicator {
  label: string
  definition: string
  value: number
  target: number
  alert: number
  unit: '' | '%' | 'h'
  /** `up` : plus haut est meilleur ; `down` : plus bas est meilleur. */
  better: 'up' | 'down'
}

export const indicators: Indicator[] = [
  { label: 'Profils complets', definition: 'Questionnaire d’entrée terminé et profil de base rempli', value: 11850, target: 20000, alert: 8000, unit: '', better: 'up' },
  { label: 'Complétion', definition: 'Inscrits qui terminent les 5 questions d’entrée', value: 78, target: 75, alert: 55, unit: '%', better: 'up' },
  { label: 'Opportunités actives', definition: 'Offres vérifiées ouvertes à cet instant', value: 312, target: 400, alert: 150, unit: '', better: 'up' },
  { label: 'Pertinence', definition: 'Offres notées « pertinente »', value: 57, target: 60, alert: 40, unit: '%', better: 'up' },
  { label: 'Action à 30 jours', definition: 'Étudiants ayant sauvegardé ou déclaré une candidature', value: 18, target: 40, alert: 20, unit: '%', better: 'up' },
  { label: 'Rétention semaine 4', definition: 'Actifs quatre semaines après l’inscription', value: 31, target: 35, alert: 20, unit: '%', better: 'up' },
  { label: 'Structures actives', definition: 'Structures vérifiées ayant publié au moins une offre', value: 34, target: 60, alert: 20, unit: '', better: 'up' },
  { label: 'Utilité de l’orientation', definition: 'Jeunes répondant « cette piste m’a aidé »', value: 72, target: 70, alert: 50, unit: '%', better: 'up' },
  { label: 'Exactitude de l’IA', definition: 'Réponses correctes sur le jeu de 200 questions', value: 93, target: 95, alert: 90, unit: '%', better: 'up' },
  { label: 'Offres frauduleuses', definition: 'Offres publiées jugées frauduleuses après signalement', value: 0.6, target: 1, alert: 3, unit: '%', better: 'down' },
  { label: 'Délai conseiller', definition: 'Délai médian de réponse humaine', value: 30, target: 48, alert: 120, unit: 'h', better: 'down' },
]

export type IndicatorStatus = 'ok' | 'watch' | 'alert'

/** Dans la cible, entre la cible et le seuil, ou au-delà du seuil d'alerte. */
export function statusOf(i: Indicator): IndicatorStatus {
  if (i.better === 'up') return i.value >= i.target ? 'ok' : i.value >= i.alert ? 'watch' : 'alert'
  return i.value <= i.target ? 'ok' : i.value <= i.alert ? 'watch' : 'alert'
}
