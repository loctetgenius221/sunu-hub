# SUNU HŪB : plan de construction du front (MVP)

Sources : `TDR – MVP SUNU HŪB.md` (périmètre), `SUNU HŪB- Projet.pdf` (charte), `DIRECTION-ARTISTIQUE-PROPOSITION-1.md` (style).
Toutes les données viennent de `src/data/*` (mocks) via `src/services/api.ts`, seul fichier à changer quand l'API existera.

## Charte retenue (extraite du PDF)

| Rôle (DA)            | Couleur  | Hex       |
| -------------------- | -------- | --------- |
| Structure            | Marine   | `#0C3470` |
| Action / chaleur     | Orange   | `#FF6B00` |
| Signal               | Vert vif | `#00FF57` |
| Texte sur marine     | Menthe   | `#81FFAC` |
| Fond alterné         | Papier 2 | `#F5FAF9` |

Polices : Newsreader (titres serif, comme les titres marine du PDF), Montserrat (texte et logotype).
Logo : monogramme « S » vectorisé depuis le PDF (`SunuMark.vue`), logotype `SunuLogo.vue`.

## Architecture

```
src/
  assets/main.css        tokens Tailwind v4 + utilitaires (.display, .h2, .wrap, .grid-paper, .section)
  components/
    brand/               SunuMark, SunuLogo
    art/                 moteur isométrique (iso.ts, scenes.ts, IsoArt.vue) + ParcoursStack (signature)
    ui/                  BaseButton, TextLink, PhotoFrame, AttrPill, FigureCaption
    layout/              SiteHeader, SiteFooter, MarqueeBand
    home/                sections de l'accueil
  composables/useMotion  révélation à l'écran (motion), mouvement réduit
  data/                  mocks + contenus éditoriaux
  services/              api.ts (accès données), matching.ts (moteur de règles TDR §6.2)
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
