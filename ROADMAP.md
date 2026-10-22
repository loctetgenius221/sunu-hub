# SUNU HŪB : plan de construction du front (MVP)

Sources : `TDR – MVP SUNU HŪB.md` (périmètre), `SUNU HŪB- Projet.pdf` (charte et logo).
Toutes les données viennent de `src/data/*` (mocks) via `src/services/api.ts`, seul fichier à changer quand l'API existera.

## Direction artistique : « Institutionnel premium » (refonte d'octobre 2026)

Inspirée des principes d'Apple : beaucoup d'air, grands titres serrés, photographie, un seul effet marquant par page.
Elle remplace la première direction (« Éditorial isométrique ») ; l'ancienne version reste sur la branche `develop`.

| Rôle                         | Couleur      | Hex       |
| ---------------------------- | ------------ | --------- |
| Institutionnel (boutons, liens, sections sombres) | Marine | `#0C3470` / `#071E44` |
| Urgence seulement (date proche, alerte) | Orange texte | `#C2410C` sur `#FFF1E6` |
| « Vérifié » seulement        | Vert         | `#0B6B33` sur `#E4F5EA` |
| Fonds                        | Blanc, porcelaine | `#FFFFFF`, `#F5F5F7` |
| Texte                        | Encre, gris  | `#1D1D1F`, `#6E6E73` |

- Police unique : Instrument Sans (titres en 600, interlettrage resserré). Montserrat ne sert qu'au logotype de la charte.
- Formes : tuiles arrondies (28 px), cartes (20 px), champs (12 px), boutons pilule ; ombres douces, filets fins.
- Photos : aucune. Tous les en-têtes utilisent la couleur principale (marine profond), avec les motifs textiles en SVG.
- Orange du logo (`#FF6B00`) en signature discrète, toujours décorative : barre d'accent au-dessus des titres d'en-tête (reprise du macron de HŪB), trait sous la navigation active, indicateur d'onglet mobile, étape en cours de l'inscription, point « ouvertes en ce moment ».
- Mouvement (motion) : téléphone fixe dans « Comment ça marche », compteur ; tout est coupé en mouvement réduit.
- Utilisabilité : navigation mobile par le menu, boutons principaux pleine largeur sur téléphone, filtres rapides par type, actions principales en haut des fiches, curseur placé d'office dans les champs de l'inscription.
- Contrastes vérifiés à l'audit axe-core (texte ≥ 4,5:1).

## Architecture

```
src/
  assets/main.css        tokens Tailwind v4 + utilitaires (.display, .h2, .lead, .wrap, .field, .card, .section)
  components/
    brand/               SunuMark, SunuLogo
    ui/                  BaseButton, TextLink, ChoiceChips, SectionHead
    layout/              SiteHeader (translucide), SiteFooter, ToastHost
    home/                sections de l'accueil (héros photo, tuiles, rayonnage, comment ça marche…)
    opportunity/ school/ profile/ signup/ orient/ admin/   composants par domaine
  composables/           useMotion (mouvement réduit, compteur), useToast
  data/                  mocks, contenus éditoriaux
  services/              api.ts, moteurs (matching, orientation), filtres, modération, assistant
  stores/                profil, activité, orientation, structure (persistés sur l'appareil)
  types/                 modèle de données partagé
  views/                 une vue par route
```

## Étapes

- [x] **1. Fondations** : charte, logo, tokens, polices, mise en page, routeur, types, mocks, service, moteur de score (testé), moteur d'illustrations isométriques.
- [x] **2. Portail** : héros « Je suis… » + illustration « Le Hub » (bâtiments qui envoient les opportunités vers le jeune), deux portes, aperçu du fil (tickets), vérificateur express, alertes WhatsApp, structures, engagements de neutralité, bande défilante, appel final.
- [x] **3. Inscription et profil** (P1–P4) : téléphone + code simulé (123456), identité et consentement horodaté (accord parental sous 18 ans), 5 questions avec reprise après coupure, page profil (jauge, fil personnel, compléments, alertes, CV imprimable, lien public, export et suppression des données), store Pinia persistant.
- [x] **4. Opportunités** (Q1–Q7) : fil trié par score (ou par date sans profil), recherche et filtres partageables dans l'URL, fiche avec source et lien d'origine, sauvegarde avec rappels J-7 / J-1, suivi de candidature en 4 étapes, avis pertinent / pas pertinent, signalement (masquage à 3), vues Sauvegardées et Candidatures.
- [x] **5. Vérificateur d'école** (O1, base O2) : recherche sans accents (partageable par URL), explication des 4 statuts, 4 réflexes avant de payer, demande de vérification, fiche école partageable (verdict, tableau des formations avec statuts séparés, coûts en fourchette, source et date, partage WhatsApp et copie du lien).
- [x] **6. Espace structures** (S1–S3) : page de présentation, compte vérifié (e-mail pro ou NINEA, validation simulée), tableau de bord, publication en formulaire court avec audience estimée en direct et refus des offres payantes, validation avant mise en ligne, candidatures classées par score avec statut visible par le jeune et export CSV.
- [x] **7. Orienter (V2)** (O2–O8) : questionnaire de 15 questions (sauvegarde à chaque réponse, pré-rempli depuis le profil), moteur 35/25/15/15/10 avec filtres (série, établissement vérifié, budget, ville), 3 pistes + 2 élargies avec pourquoi, statut, coût, débouchés (estimation) et risques, liste de vœux Campusen ordonnée avec plan B et export WhatsApp / PDF, résumé famille imprimable, assistant simulé (source et date, « je ne sais pas », signalement, limite quotidienne), demande de conseiller.
- [x] **8. Finitions** : PWA installable (manifeste, icônes, service worker, polices en cache, fiches consultables hors ligne), back-office `/equipe` (indicateurs du TDR §9, curation des offres, file de validation des structures et des offres, journal), audit axe-core sur 20 pages, poids mesuré (~110 Ko de site par page, polices allégées de 320 à 200 Ko max), modération à deux niveaux (blocage / relecture).
- [x] **9. Refonte « Institutionnel premium »** : nouveau design system (Instrument Sans, marine, gris Apple, arrondis, ombres douces), photos optimisées, accueil refait (héros photo qui s'ouvre au défilement, tuiles, rayonnage, téléphone fixe), toutes les pages restylées, illustrations isométriques supprimées, contrastes corrigés (audit axe sans violation sur 25 pages).
- [x] **10. Simplification** : héros sur la couleur principale avec aperçu des offres réelles selon le stade, une seule photo, accueil raccourci (tuiles d'entrée directe), filtres rapides, actions en haut de fiche, en-têtes compacts.
