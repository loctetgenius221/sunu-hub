// Métadonnées d'orientation des formations (TDR O2), rattachées aux programmes de `schools.ts`.
// Données fictives. Les débouchés ne viennent d'aucune source officielle : ils sont marqués « estimation ».

export type Selectivity = 'forte' | 'moyenne' | 'ouverte'

export interface FormationMeta {
  programId: string
  field: string
  subjects: string[]
  jobs: string[]
  selectivity: Selectivity
  outcomes: string[]
}

export const formationMeta: FormationMeta[] = [
  { programId: 'p1', field: 'informatique', subjects: ['maths', 'physique'], jobs: ['developpeur', 'ingenieur'], selectivity: 'forte', outcomes: ['Développeur', 'Administrateur réseau', 'Analyste de données'] },
  { programId: 'p1d', field: 'sciences', subjects: ['maths', 'physique'], jobs: ['ingenieur', 'enseignant'], selectivity: 'forte', outcomes: ['Poursuite en école d’ingénieurs', 'Enseignant', 'Technicien de laboratoire'] },
  { programId: 'p1b', field: 'gestion', subjects: ['maths', 'economie'], jobs: ['comptable', 'entrepreneur', 'commercial'], selectivity: 'moyenne', outcomes: ['Assistant comptable', 'Chargé de clientèle', 'Gestionnaire de PME'] },
  { programId: 'p2', field: 'gestion', subjects: ['economie', 'francais'], jobs: ['comptable', 'commercial', 'entrepreneur'], selectivity: 'ouverte', outcomes: ['Assistant de gestion', 'Commercial', 'Chef de projet junior'] },
  { programId: 'p4', field: 'informatique', subjects: ['maths'], jobs: ['developpeur'], selectivity: 'ouverte', outcomes: ['Développeur web'] },
  { programId: 'p5', field: 'droit', subjects: ['francais', 'philo', 'histoire'], jobs: ['avocat'], selectivity: 'ouverte', outcomes: ['Juriste d’entreprise', 'Concours de la magistrature', 'Notariat'] },
  { programId: 'p5b', field: 'lettres', subjects: ['francais', 'philo', 'anglais'], jobs: ['enseignant', 'journaliste'], selectivity: 'ouverte', outcomes: ['Enseignant', 'Métiers de l’édition', 'Concours administratifs'] },
  { programId: 'p6', field: 'agriculture', subjects: ['svt', 'physique'], jobs: ['agronome', 'entrepreneur'], selectivity: 'forte', outcomes: ['Conseiller agricole', 'Technicien agronome', 'Entrepreneur agricole'] },
  { programId: 'p7', field: 'sante', subjects: ['svt', 'physique'], jobs: ['soignant'], selectivity: 'forte', outcomes: ['Infirmier en hôpital ou clinique', 'Infirmier scolaire'] },
  { programId: 'p8', field: 'sante', subjects: ['svt', 'physique', 'maths'], jobs: ['soignant', 'ingenieur'], selectivity: 'moyenne', outcomes: ['Technicien de laboratoire médical', 'Assistant de recherche'] },
  { programId: 'p9', field: 'communication', subjects: ['francais', 'anglais', 'histoire'], jobs: ['journaliste', 'commercial'], selectivity: 'ouverte', outcomes: ['Chargé de communication', 'Journaliste', 'Community manager'] },
]
