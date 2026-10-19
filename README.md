# SUNU HŪB : front-end du MVP

Maquette fonctionnelle de la plateforme décrite dans `TDR – MVP SUNU HŪB.md`, avec la charte et le logo de `SUNU HŪB- Projet.pdf`, en direction artistique « Institutionnel premium » (décrite dans ROADMAP.md). Le plan de construction et l'état de chaque étape sont dans [ROADMAP.md](ROADMAP.md).

Stack : Vue 3, Vite, TypeScript, Tailwind CSS v4, Pinia, Vue Router, `motion` (animations), `lucide-vue-next` (icônes), `vite-plugin-pwa`.

## Démarrer

```sh
npm install
npm run dev          # http://localhost:5173
npm run test:unit    # tests Vitest
npm run build        # vérification des types + build de production (PWA comprise)
npm run preview      # sert le build, service worker actif
```

## Ce qu'il faut savoir sur la maquette

- **Toutes les données sont fictives** (`src/data/`). Aucune école, structure ou offre ne décrit un organisme réel.
- **Aucun serveur** : tout passe par `src/services/api.ts`, qui lit les mocks avec une latence simulée. C'est le seul fichier à remplacer par des appels à l'API.
- **Les données saisies restent dans le navigateur** (`localStorage`, clés `sunu-hub:*`) : profil, activité, orientation, espace structure, décisions de curation.
- **Code de connexion** : `123456`.
- **Validations de l'équipe** (compte structure, offre publiée) : boutons « Maquette : simuler la validation », ou back-office.
- **Back-office** : `/equipe` (lien « Espace équipe » en pied de page), sans authentification.

## Parcours principaux

| Parcours | Routes |
| --- | --- |
| Portail | `/` |
| Inscription et profil (P1–P4) | `/inscription`, `/profil`, `/profil/cv` |
| Opportunités (Q1–Q7) | `/opportunites`, `/opportunites/:id` |
| Vérificateur d'école (O1) | `/verifier-ecole`, `/verifier-ecole/:id` |
| Orienter (O2–O8) | `/orienter`, `/orienter/questionnaire`, `/orienter/pistes`, `/orienter/voeux`, `/orienter/resume`, `/orienter/assistant` |
| Structures (S1–S3) | `/structures`, `/structures/inscription`, `/structures/espace`, `/structures/publier`, `/structures/offres/:id` |
| Back-office (A1, A2, A3, A7) | `/equipe` |

## Organisation du code

```
src/
  assets/main.css     tokens de la charte (couleurs, polices) et utilitaires (.display, .h2, .wrap, .field…)
  components/
    brand/            logo (monogramme extrait du PDF) et logotype
    ui/               boutons, liens, photos responsives, choix multiples, en-têtes de section
    layout/           en-tête, pied de page, bande défilante, messages de confirmation
    home/ opportunity/ school/ profile/ signup/ orient/ admin/   composants par domaine
  composables/        mouvement (mouvement réduit, compteur animé), messages (useToast)
  data/               données fictives, contenus éditoriaux et photos (aucun texte en dur dans les composants)
  services/           accès aux données, moteurs de règles (matching, orientation), filtres, modération, assistant
  stores/             profil, activité, orientation, structure (Pinia, persistés sur l'appareil)
  views/              une vue par route
```

## Moteurs de règles (TDR §6.2)

- Opportunités : `score = 30·filière + 25·niveau + 15·type + 15·lieu + 15·disponibilité`, dans `services/matching.ts`.
- Orientation : `score = 35·intérêts + 25·matières + 15·métiers + 15·contraintes + 10·accessibilité`, dans `services/orientation.ts`. Les établissements non habilités ne sont jamais proposés, et l'accessibilité est donnée en fourchette.
- Modération : les demandes d'argent explicites bloquent la publication ; les mots ambigus sont signalés à l'équipe (`services/moderation.ts`).

## Qualité vérifiée

- Rendu vérifié de 360 à 1440 px, sans débordement horizontal.
- Audit axe-core sur 25 pages : aucune violation hors des outils de développement.
- Poids d'une page (production, mobile) : environ 110 Ko de site, 148 Ko de polices à la première visite (mises en cache ensuite), et de 0 à 200 Ko de photos selon la page (200 Ko sur l'accueil).
- Hors ligne : après une première visite, les fiches d'école et d'offre s'affichent sans connexion.
