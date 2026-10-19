// Photographie (provisoire) : Unsplash, licence Unsplash (usage libre, crédit apprécié).
// Deux photos seulement, par choix : les pages restent légères et vont à l'essentiel.
// Fichiers WebP dans /public/images, en deux largeurs. À remplacer par des photos SUNU HŪB.

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
  ecoles: {
    name: 'ecoles',
    widths: [640, 1200],
    alt: 'Des diplômés en toge posent ensemble devant leur université.',
    credit: '150 Billi',
    url: 'https://unsplash.com/photos/FQqRVH1EVjg',
    focus: '50% 30%',
  },
  structures: {
    name: 'structures',
    widths: [800, 1600],
    alt: 'Trois femmes échangent autour d’une table de réunion, ordinateurs ouverts.',
    credit: 'Christina @ wocintechchat.com',
    url: 'https://unsplash.com/photos/UcZcsHSp8o4',
    focus: '50% 40%',
  },
} satisfies Record<string, Photo>

export type PhotoName = keyof typeof photos
