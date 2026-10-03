import type { ApplicationStep, CandidateStatus, OpportunityType, SchoolStatus, StructureKind, VerificationStatus } from '@/types'

// Libellés d'interface partagés (une seule formulation partout).

export const opportunityTypes: Record<OpportunityType, string> = {
  stage: 'Stage',
  emploi: 'Emploi junior',
  bourse: 'Bourse',
  concours: 'Concours',
  formation: 'Formation',
  financement: 'Financement',
  evenement: 'Événement',
}

export const verification: Record<VerificationStatus, { label: string; hint: string }> = {
  verifiee: { label: 'Vérifiée', hint: "Contrôlée par l'équipe SUNU HŪB" },
  externe: { label: 'Source externe', hint: "Reprise d'un autre site, lien d'origine fourni" },
  'a-verifier': { label: 'À vérifier', hint: 'En attente de contrôle' },
}

/** Statut d'école en langage simple (TDR O1). */
export const schoolStatus: Record<SchoolStatus, { label: string; explain: string; tone: 'ok' | 'warn' | 'bad' }> = {
  public: { label: 'Établissement public', explain: "Établissement de l'État : diplômes reconnus.", tone: 'ok' },
  habilite: {
    label: 'Habilité',
    explain: "L'État l'autorise à délivrer des diplômes. Vérifie aussi l'accréditation de ta formation.",
    tone: 'ok',
  },
  'non-habilite': {
    label: 'Non habilité',
    explain: "Cet établissement n'est pas autorisé à délivrer des diplômes reconnus. Prudence avant de payer.",
    tone: 'bad',
  },
  'non-verifie': {
    label: 'Pas encore vérifié',
    explain: "Nous n'avons pas encore de source officielle pour cet établissement.",
    tone: 'warn',
  },
}

// Mois en toutes lettres : évite le double point « oct.. » en fin de phrase.
const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })
export const formatDate = (d: string | Date) => dateFmt.format(new Date(d))

export const applicationSteps: { id: ApplicationStep; label: string }[] = [
  { id: 'enregistree', label: 'Enregistrée' },
  { id: 'envoyee', label: 'Envoyée' },
  { id: 'entretien', label: 'Entretien' },
  { id: 'reponse', label: 'Réponse reçue' },
]

export const reportReasons = [
  "On me demande de l'argent",
  'Fausse offre ou structure inconnue',
  'Date limite dépassée',
  'Informations incorrectes',
]

export const structureKinds: Record<StructureKind, string> = {
  entreprise: 'Entreprise',
  ong: 'ONG ou association',
  ecole: 'École ou institut',
  universite: 'Université',
  incubateur: 'Incubateur',
  institution: 'Institution publique',
}

/** Statut d'une candidature côté structure ; le jeune le voit dans son suivi. */
export const candidateStatuses: Record<CandidateStatus, string> = {
  nouvelle: 'Nouvelle',
  'en-cours': 'En cours d’examen',
  entretien: 'Entretien proposé',
  retenue: 'Retenue',
  'non-retenue': 'Non retenue',
}
