// Photographies (provisoires) : Unsplash, licence Unsplash (usage libre, crédit apprécié).
// Fichiers WebP dans /public/images, en deux largeurs chacun. À remplacer par des photos SUNU HŪB.

export interface Photo {
  name: string
  widths: [number, number]
  alt: string
  credit: string
  url: string
  /** Point d'intérêt pour le recadrage (object-position). */
  focus?: string
}

export const photos = {
  hero: {
    name: 'hero',
    widths: [1000, 1600],
    alt: 'Un groupe de jeunes assis sur les marches d’une place, ordinateurs portables sur les genoux, discutent et rient.',
    credit: 'Iwaria Inc.',
    url: 'https://unsplash.com/photos/vWqBjWbc_H4',
    focus: '62% 72%',
  },
  opportunites: {
    name: 'opportunites',
    widths: [640, 1200],
    alt: 'Une jeune femme en veste bleue travaille sur un ordinateur portable dans un espace de travail partagé.',
    credit: 'Akinyemi Gbadamosi',
    url: 'https://unsplash.com/photos/T_CkxezKRTA',
    focus: '65% 40%',
  },
  orienter: {
    name: 'orienter',
    widths: [640, 1200],
    alt: 'Une jeune diplômée souriante, toque sur la tête, tient son diplôme.',
    credit: 'Felipe Gregate',
    url: 'https://unsplash.com/photos/Ph2KD5qr7VQ',
    focus: '50% 35%',
  },
  ecoles: {
    name: 'ecoles',
    widths: [640, 1200],
    alt: 'Des diplômés en toge posent ensemble devant leur université.',
    credit: '150 Billi',
    url: 'https://unsplash.com/photos/FQqRVH1EVjg',
    focus: '50% 30%',
  },
  alertes: {
    name: 'alertes',
    widths: [640, 1200],
    alt: 'Une jeune femme parle au téléphone à son bureau, un ordinateur ouvert devant elle.',
    credit: 'Vitaly Gariev',
    url: 'https://unsplash.com/photos/n1yI8oExVns',
    focus: '60% 40%',
  },
  structures: {
    name: 'structures',
    widths: [800, 1600],
    alt: 'Trois femmes échangent autour d’une table de réunion, ordinateurs ouverts.',
    credit: 'Christina @ wocintechchat.com',
    url: 'https://unsplash.com/photos/UcZcsHSp8o4',
    focus: '50% 40%',
  },
  etudiant: {
    name: 'etudiant',
    widths: [640, 1200],
    alt: 'Un étudiant concentré travaille sur son ordinateur portable.',
    credit: 'Kojo Kwarteng',
    url: 'https://unsplash.com/photos/KUzlAah2dog',
    focus: '45% 35%',
  },
  etudiante: {
    name: 'etudiante',
    widths: [640, 1200],
    alt: 'Une étudiante sourit, assise devant son ordinateur dans une salle de cours.',
    credit: 'Makmot Robin',
    url: 'https://unsplash.com/photos/APU7etSy58k',
    focus: '60% 35%',
  },
  lyceen: {
    name: 'lyceen',
    widths: [640, 1200],
    alt: 'Un lycéen travaille sur son ordinateur portable chez lui, près d’une fenêtre.',
    credit: 'Joyce Obi',
    url: 'https://unsplash.com/photos/cC2VHH_1YyE',
    focus: '40% 45%',
  },
} satisfies Record<string, Photo>

export type PhotoName = keyof typeof photos
