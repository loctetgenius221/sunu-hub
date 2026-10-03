import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { applicants } from '@/data/applicants'
import { scoreOpportunity } from '@/services/matching'
import type { CandidateStatus, Opportunity, PublishedOffer, StructureAccount } from '@/types'

// Espace d'une structure (TDR S1–S3), conservé sur l'appareil en attendant l'API.

const KEY = 'sunu-hub:structure'

interface Saved {
  account: StructureAccount | null
  offers: PublishedOffer[]
  candidates: Record<string, Record<string, CandidateStatus>> // offre → candidat → statut
}

const blank = (): Saved => ({ account: null, offers: [], candidates: {} })

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...blank(), ...JSON.parse(raw) } : blank()
  } catch {
    return blank()
  }
}

/** Seuil sous lequel un candidat n'apparaît pas dans le tableau de l'offre. */
const MIN_SCORE = 45

export const useStructureStore = defineStore('structure', () => {
  const state = ref<Saved>(load())

  watch(
    state,
    (s) => {
      try {
        localStorage.setItem(KEY, JSON.stringify(s))
      } catch {
        /* stockage indisponible */
      }
    },
    { deep: true },
  )

  const verified = computed(() => state.value.account?.status === 'verified')

  function createAccount(a: Omit<StructureAccount, 'status' | 'createdAt'>) {
    state.value.account = { ...a, status: 'pending', createdAt: new Date().toISOString() }
  }

  function publish(o: Omit<PublishedOffer, 'id' | 'status' | 'createdAt'>) {
    const offer: PublishedOffer = { ...o, id: `s-${Date.now().toString(36)}`, status: 'en-revue', createdAt: new Date().toISOString() }
    state.value.offers.unshift(offer)
    return offer
  }

  const getOffer = (id: string) => state.value.offers.find((o) => o.id === id)

  /** Candidats classés par adéquation à l'offre (le moteur jeune → offre, appliqué à l'envers). */
  function candidatesFor(offer: PublishedOffer) {
    const asOpportunity: Opportunity = {
      ...offer,
      structureId: 'moi',
      freeForCandidate: true,
      sourceUrl: '',
      sourceName: state.value.account?.name ?? '',
      collectedAt: offer.createdAt,
      status: 'verifiee',
    }
    const structure = { id: 'moi', name: asOpportunity.sourceName, kind: state.value.account?.kind ?? 'entreprise', city: offer.city, verified: true }
    return applicants
      .map((a) => {
        const { score, reasons } = scoreOpportunity(asOpportunity, structure, a)
        const status: CandidateStatus = state.value.candidates[offer.id]?.[a.id] ?? 'nouvelle'
        return { ...a, score, reasons, status }
      })
      .filter((c) => c.score >= MIN_SCORE)
      .sort((x, y) => y.score - x.score)
  }

  function setCandidateStatus(offerId: string, applicantId: string, status: CandidateStatus) {
    ;(state.value.candidates[offerId] ??= {})[applicantId] = status
  }

  // Maquette : simule les validations faites par l'équipe SUNU HŪB (compte sous 48 h, offre sous 24 h).
  function simulateAccountReview() {
    if (state.value.account) state.value.account.status = 'verified'
  }

  function simulateOfferReview(id: string) {
    const o = getOffer(id)
    if (o) o.status = 'publiee'
  }

  function reset() {
    state.value = blank()
  }

  return { state, verified, createAccount, publish, getOffer, candidatesFor, setCandidateStatus, simulateAccountReview, simulateOfferReview, reset }
})
