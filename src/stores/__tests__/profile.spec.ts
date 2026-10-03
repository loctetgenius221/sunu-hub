import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProfileStore } from '../profile'

describe('profile store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('efface les réponses dépendantes quand le stade change', () => {
    const s = useProfileStore()
    s.answer('stage', 'etudiant')
    s.answer('track', 'L3')
    s.answer('goal', 'stage')
    s.answer('stage', 'terminale')
    expect(s.state.answers.track).toBeUndefined()
    expect(s.state.answers.goal).toBeUndefined()
  })

  it('ne produit un profil qu’une fois inscription et questionnaire terminés', () => {
    const s = useProfileStore()
    s.answer('stage', 'etudiant')
    s.answer('track', 'M1')
    s.answer('field', 'informatique')
    s.answer('city', 'Dakar')
    s.answer('goal', 'stage')
    expect(s.profile).toBeNull()
    s.state.verified = true
    s.giveConsent()
    expect(s.profile?.level).toBe('master')
    expect(s.state.alerts.types).toEqual(['stage'])
    expect(s.completion).toBe(50)
  })

  it('détecte un mineur', () => {
    const s = useProfileStore()
    s.state.birthYear = new Date().getFullYear() - 16
    expect(s.isMinor).toBe(true)
  })
})
