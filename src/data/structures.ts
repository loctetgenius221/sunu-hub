import type { Structure } from '@/types'

// Données fictives (maquette). À remplacer par l'API.
export const structures: Structure[] = [
  { id: 's1', name: 'Teranga Digital', kind: 'entreprise', city: 'Dakar', verified: true },
  { id: 's2', name: 'Fondation Baobab', kind: 'ong', city: 'Thiès', verified: true },
  { id: 's3', name: 'Ndaje Lab', kind: 'incubateur', city: 'Dakar', verified: true },
  { id: 's4', name: 'Institut Cap-Vert Management', kind: 'ecole', city: 'Dakar', verified: true },
  { id: 's5', name: 'Saloum Agro', kind: 'entreprise', city: 'Kaolack', verified: false },
  { id: 's6', name: 'Programme Jeunesse Avenir', kind: 'institution', city: 'Saint-Louis', verified: true },
]
