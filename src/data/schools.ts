import type { School } from '@/types'

// Données fictives (maquette) pour le vérificateur d'école (TDR O1, O2).
// Aucune de ces fiches ne décrit un établissement réel.
export const schools: School[] = [
  {
    id: 'e1',
    name: 'Université publique du Littoral',
    acronym: 'UPL',
    city: 'Dakar',
    status: 'public',
    source: 'Liste des établissements publics (maquette)',
    verifiedAt: '2026-09-15',
    programs: [
      { id: 'p1', name: 'Licence Informatique', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['S1', 'S2'], costRange: [25000, 50000] },
      { id: 'p1b', name: 'Licence Économie et gestion', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['L1', 'L2', 'S1', 'S2', 'G'], costRange: [25000, 50000] },
      { id: 'p1d', name: 'Licence Mathématiques-Physique', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['S1', 'S2', 'S3'], costRange: [25000, 50000] },
      { id: 'p1c', name: 'Master Santé publique', level: 'master', durationYears: 2, accredited: true, cames: true, admittedSeries: [], costRange: [60000, 100000] },
    ],
  },
  {
    id: 'e2',
    name: 'Institut Cap-Vert Management',
    acronym: 'ICVM',
    city: 'Dakar',
    status: 'habilite',
    source: 'Décision ANAQ-Sup (maquette)',
    verifiedAt: '2026-09-02',
    programs: [
      { id: 'p2', name: 'Licence Gestion des entreprises', level: 'licence', durationYears: 3, accredited: true, cames: false, admittedSeries: ['L1', 'L2', 'S1', 'S2', 'G'], costRange: [650000, 900000] },
      { id: 'p3', name: 'Master Marketing digital', level: 'master', durationYears: 2, accredited: false, cames: false, admittedSeries: [], costRange: [900000, 1200000] },
    ],
  },
  {
    id: 'e3',
    name: 'École Supérieure Horizon Tech',
    acronym: 'ESHT',
    city: 'Thiès',
    status: 'non-habilite',
    source: 'Décision ANAQ-Sup (maquette)',
    verifiedAt: '2026-08-21',
    programs: [
      { id: 'p4', name: 'Bachelor Développement web', level: 'licence', durationYears: 3, accredited: false, cames: false, admittedSeries: ['S1', 'S2', 'T'], costRange: [750000, 1000000] },
    ],
  },
  {
    id: 'e4',
    name: 'Académie des Métiers du Sine',
    city: 'Fatick',
    status: 'non-verifie',
    source: 'En cours de vérification',
    verifiedAt: '2026-09-28',
    programs: [],
  },
  {
    id: 'e5',
    name: 'Université publique du Fleuve',
    acronym: 'UPF',
    city: 'Saint-Louis',
    status: 'public',
    source: 'Liste des établissements publics (maquette)',
    verifiedAt: '2026-09-10',
    programs: [
      { id: 'p5', name: 'Licence Droit privé', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['L1', 'L2', 'S1', 'S2', 'G'], costRange: [25000, 50000] },
      { id: 'p5b', name: 'Licence Lettres modernes', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['L1', 'L2'], costRange: [25000, 50000] },
      { id: 'p6', name: 'Licence Agronomie', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['S1', 'S2'], costRange: [25000, 50000] },
    ],
  },
  {
    id: 'e6',
    name: 'Institut Supérieur des Métiers de Santé Téranga',
    acronym: 'ISMST',
    city: 'Dakar',
    status: 'habilite',
    source: 'Décision ANAQ-Sup (maquette)',
    verifiedAt: '2026-07-30',
    programs: [
      { id: 'p7', name: 'Licence Sciences infirmières', level: 'licence', durationYears: 3, accredited: true, cames: true, admittedSeries: ['S1', 'S2'], costRange: [800000, 1100000] },
      { id: 'p8', name: 'Licence Biologie médicale', level: 'licence', durationYears: 3, accredited: true, cames: false, admittedSeries: ['S1', 'S2'], costRange: [750000, 950000] },
    ],
  },
  {
    id: 'e7',
    name: 'École de Communication de la Petite-Côte',
    acronym: 'ECPC',
    city: 'Mbour',
    status: 'habilite',
    source: 'Décision ANAQ-Sup (maquette)',
    verifiedAt: '2026-09-18',
    programs: [
      { id: 'p9', name: 'Licence Communication et journalisme', level: 'licence', durationYears: 3, accredited: false, cames: false, admittedSeries: ['L1', 'L2'], costRange: [500000, 700000] },
    ],
  },
  {
    id: 'e8',
    name: 'Centre Polytechnique de Ziguinchor',
    acronym: 'CPZ',
    city: 'Ziguinchor',
    status: 'non-habilite',
    source: 'Décision ANAQ-Sup (maquette)',
    verifiedAt: '2026-06-12',
    programs: [],
  },
]
