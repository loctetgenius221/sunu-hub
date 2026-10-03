import { describe, expect, it } from 'vitest'
import { getSchool, searchSchools } from '../api'

describe('vérificateur d’école', () => {
  it('trouve par sigle ou par nom, sans accents', async () => {
    expect((await searchSchools('icvm')).map((s) => s.id)).toEqual(['e2'])
    expect((await searchSchools('ecole superieure')).map((s) => s.id)).toEqual(['e3'])
  })

  it('renvoie une liste vide pour une saisie vide et null pour un identifiant inconnu', async () => {
    expect(await searchSchools('  ')).toEqual([])
    expect(await getSchool('inconnu')).toBeNull()
  })
})
