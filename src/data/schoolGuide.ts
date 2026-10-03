import type { SceneKind } from '@/components/art/scenes'

// Contenus pédagogiques du vérificateur (TDR §2.1 : trois statuts à ne pas confondre).

export const officialStatuses: { term: string; who: string; meaning: string; art: SceneKind }[] = [
  {
    term: 'Agrément',
    who: 'Concerne l’établissement',
    meaning: 'L’école a le droit d’ouvrir et d’accueillir des étudiants. Cela ne suffit pas pour délivrer des diplômes reconnus.',
    art: 'sheets',
  },
  {
    term: 'Habilitation',
    who: 'Concerne l’établissement',
    meaning: 'Après évaluation de l’ANAQ-Sup, l’État autorise l’école à délivrer des diplômes. C’est le statut à vérifier en premier.',
    art: 'shield',
  },
  {
    term: 'Accréditation',
    who: 'Concerne une formation précise',
    meaning: 'La qualité d’un programme donné est reconnue. Une école habilitée peut avoir des formations accréditées et d’autres non.',
    art: 'steps',
  },
  {
    term: 'Reconnaissance CAMES',
    who: 'Concerne une formation précise',
    meaning: 'Reconnaissance régionale du diplôme, utile pour poursuivre ses études ou travailler dans d’autres pays africains. Elle vaut accréditation.',
    art: 'network',
  },
]

export const reflexes = [
  'Vérifie l’habilitation de l’établissement, puis l’accréditation de ta formation : ce sont deux choses différentes.',
  'Demande l’arrêté d’habilitation et note sa date. Une école sérieuse le montre sans difficulté.',
  'Méfie-toi des promesses d’emploi garanti et des frais à payer « avant ce soir ».',
  'Garde une trace écrite de tout paiement et de la formation exacte à laquelle tu t’inscris.',
]
