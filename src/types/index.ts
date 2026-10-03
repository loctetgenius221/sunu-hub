// Modèle de données du MVP (TDR §6 et §7). Les mocks et la future API partagent ces types.

export type Stage = 'terminale' | 'bachelier' | 'etudiant' | 'diplome'

export type Level = 'bac' | 'licence' | 'master' | 'tous'

export type OpportunityType =
  | 'stage'
  | 'emploi'
  | 'bourse'
  | 'concours'
  | 'formation'
  | 'financement'
  | 'evenement'

/** « Vérifiée » : contrôlée par l'équipe ; « Source externe » : reprise avec renvoi ; « À vérifier » : en attente. */
export type VerificationStatus = 'verifiee' | 'externe' | 'a-verifier'

export interface Structure {
  id: string
  name: string
  kind: 'entreprise' | 'ong' | 'ecole' | 'universite' | 'incubateur' | 'institution'
  city: string
  verified: boolean
}

export interface Opportunity {
  id: string
  title: string
  type: OpportunityType
  structureId: string
  summary: string
  levels: Level[]
  fields: string[]
  city: string
  remote: boolean
  deadline: string // ISO
  conditions: string[]
  freeForCandidate: boolean
  sourceUrl: string
  sourceName: string
  collectedAt: string // ISO
  status: VerificationStatus
}

/** Les trois statuts officiels sont affichés séparément (TDR §2.1). */
export type SchoolStatus = 'public' | 'habilite' | 'non-habilite' | 'non-verifie'

export interface Program {
  id: string
  name: string
  level: Level
  durationYears: number
  accredited: boolean
  cames: boolean
  admittedSeries: string[]
  costRange: [number, number] | null // FCFA par an
}

export interface School {
  id: string
  name: string
  acronym?: string
  city: string
  status: SchoolStatus
  programs: Program[]
  source: string
  verifiedAt: string // ISO
}

export type Goal = OpportunityType | 'orientation'

/** Profil tel que le lit le moteur de recommandation. */
export interface Profile {
  phone: string
  firstName: string
  stage: Stage
  level: Level
  field: string
  city: string
  goal: Goal
}

/** Réponses au questionnaire d'entrée (TDR P2). `track` : série du bac ou année d'études (L1…M2). */
export interface EntryAnswers {
  stage?: Stage
  track?: string
  field?: string
  city?: string
  goal?: Goal
}

export type AlertChannel = 'whatsapp' | 'sms' | 'email'

/** Préférences d'alertes (TDR P4) : plafond de 3 messages par semaine par défaut. */
export interface AlertPrefs {
  channel: AlertChannel
  types: OpportunityType[]
  perWeek: 1 | 2 | 3
}

export interface Consent {
  acceptedAt: string // ISO, horodatage du consentement
  guardian?: { name: string; phone: string } // obligatoire sous 18 ans
}

/** Suivi de candidature (TDR Q5), mis à jour par le jeune. */
export type ApplicationStep = 'enregistree' | 'envoyee' | 'entretien' | 'reponse'

export interface Application {
  step: ApplicationStep
  updatedAt: string
}

/** Opportunité enrichie par le moteur de règles (TDR §6.2). */
export interface ScoredOpportunity extends Opportunity {
  score: number
  reasons: string[]
  structure: Structure
}

// --- Espace structures (TDR S1–S3) ---

export type StructureKind = Structure['kind']

export interface StructureAccount {
  name: string
  kind: StructureKind
  city: string
  contact: string
  email: string
  ninea: string
  /** Compte validé manuellement par l'équipe sous 48 h ouvrées. */
  status: 'pending' | 'verified'
  createdAt: string
}

/** Offre publiée par une structure : validée par l'équipe avant mise en ligne. */
export interface PublishedOffer
  extends Pick<Opportunity, 'id' | 'title' | 'type' | 'summary' | 'levels' | 'fields' | 'city' | 'remote' | 'deadline' | 'conditions'> {
  status: 'en-revue' | 'publiee'
  createdAt: string
}

export type CandidateStatus = 'nouvelle' | 'en-cours' | 'entretien' | 'retenue' | 'non-retenue'
