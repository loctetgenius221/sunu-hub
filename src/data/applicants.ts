import type { Profile } from '@/types'

// Candidats fictifs (maquette) pour le tableau des candidatures (TDR S3).
// Le jeune a postulé lui-même : ses coordonnées complètes ne sont visibles qu'avec son accord.
export interface Applicant extends Profile {
  id: string
  initial: string
  motivation: string
}

const p = (
  id: string,
  firstName: string,
  initial: string,
  level: Profile['level'],
  field: string,
  city: string,
  goal: Profile['goal'],
  motivation: string,
): Applicant => ({ id, firstName, initial, phone: '', stage: 'etudiant', level, field, city, goal, motivation })

export const applicants: Applicant[] = [
  p('a1', 'Mariama', 'D.', 'licence', 'informatique', 'Dakar', 'stage', 'Projet de fin d’études sur une application de covoiturage.'),
  p('a2', 'Cheikh', 'N.', 'master', 'informatique', 'Thiès', 'emploi', 'Deux stages en développement mobile.'),
  p('a3', 'Aïssatou', 'S.', 'licence', 'communication', 'Dakar', 'stage', 'Gère les réseaux sociaux de son association étudiante.'),
  p('a4', 'Ousmane', 'B.', 'licence', 'gestion', 'Saint-Louis', 'stage', 'Trésorier du club entrepreneuriat de son université.'),
  p('a5', 'Fatou', 'K.', 'bac', 'sciences', 'Kaolack', 'formation', 'Veut se former au numérique avant la licence.'),
  p('a6', 'Ibrahima', 'F.', 'master', 'agriculture', 'Kaolack', 'emploi', 'Mémoire sur l’irrigation goutte-à-goutte.'),
  p('a7', 'Ndeye', 'G.', 'licence', 'informatique', 'Dakar', 'stage', 'A contribué à un projet open source.'),
  p('a8', 'Moustapha', 'L.', 'licence', 'droit', 'Ziguinchor', 'stage', 'Bénévole dans une clinique juridique.'),
]
