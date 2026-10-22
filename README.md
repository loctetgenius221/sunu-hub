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
- **Pages légales** : textes dans `src/data/legal.ts`, à faire valider par un juriste. Les informations inconnues (statut juridique, adresse, hébergeur, contacts) sont marquées « à compléter » et surlignées à l'écran.

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
| Informations légales (projets à valider par un juriste) | `/mentions-legales`, `/conditions-utilisation`, `/confidentialite`, `/charte-neutralite`, `/accessibilite` |
| Aide et contact (FAQ filtrable) | `/aide` |

## Organisation du code

```
src/
  assets/main.css     tokens de la charte (couleurs, polices) et utilitaires (.display, .h2, .wrap, .field…)
  components/
    brand/            logo (monogramme extrait du PDF) et logotype
    ui/               boutons, liens, choix multiples, en-têtes de section
    layout/           en-tête, pied de page, bande défilante, messages de confirmation
    home/ opportunity/ school/ profile/ signup/ orient/ admin/   composants par domaine
  composables/        mouvement (mouvement réduit, compteur animé), messages (useToast)
  directives/         v-reveal (apparition au défilement, réversible) et v-parallax (parallaxe liée au défilement)
  data/               données fictives et contenus éditoriaux (aucun texte en dur dans les composants)
  services/           accès aux données, moteurs de règles (matching, orientation), filtres, modération, assistant
  stores/             profil, activité, orientation, structure (Pinia, persistés sur l'appareil)
  views/              une vue par route
```

## Motifs textiles

Trois dessins originaux (`public/patterns`), inspirés des tissages d'Afrique de l'Ouest sans reprendre aucun motif existant : les dessins de wax des fabricants sont protégés, et certains symboles (adinkra) ont un sens sacré.

- `tissage.svg` : la bande tissée, signature du site (rythme du kente et du pagne tissé manjak, aux couleurs SUNU HŪB). Elle ferme les bandeaux marine et ouvre le pied de page (`WaxBand`).
- `losange.svg` : treillis de losanges, ton sur ton, dans le héros de l'accueil (`WaxTexture`, avec légère parallaxe).
- `bogolan.svg` : zigzags et points, ton sur ton sur fond clair (appel final, page introuvable).

Règles : jamais derrière un texte long (un dégradé efface le motif du côté du texte), opacité de 7 % au plus pour les textures, orange réservé à la bande, aucune animation en boucle, masqués à l'impression et en mode contraste élevé, vectoriels et mis en cache hors connexion.

## Réseau du héros

`components/home/HubNetwork.vue` : « Toi » au centre, relié aux huit destinations (stage, emploi, concours, financement, incubateur, université, ONG, formation ; données dans `hubNodes`, `data/home.ts`). Les liens se tracent à l'arrivée, puis des points voyagent des destinations vers « Toi » : les opportunités viennent à toi. Le stade choisi dans « Je suis » allume les destinations qui le concernent et pilote la section « Ouvertes en ce moment » juste en dessous (`HomeLive.vue`). SVG seul, sans image ; aucune animation sous « réduire les animations ».

## Annotations dessinées

`components/brand/Doodle.vue` : trois dessins à main levée, un seul trait orange, tracés à l'écran une fois quand ils apparaissent.

- `megaphone` (tuile WhatsApp) : « on te prévient » ; il remplace l'icône de la tuile.
- `underline` (chiffres clés) : souligne « 0 FCFA », la gratuité.
- `arrow-loop` (appel final, à partir de la tablette) : désigne « Créer mon profil ».

Règles : un dessin a toujours un rôle (guider vers une action ou appuyer une promesse), jamais deux dans le même écran, jamais sur du texte. Décoratifs pour les lecteurs d'écran, visibles d'emblée sous « réduire les animations », absents à l'impression.

## Mouvement

- `v-reveal` : le bloc entre quand il arrive à l'écran et se retire quand il en sort, du côté par lequel il sort. `.stagger` décale les enfants, `.once` joue une seule fois (haut de page, pages de travail).
- `v-parallax="n"` : glissement de ±n px réglé sur le défilement (texture losange du héros de l'accueil).
- Héros de l'accueil : apparition orchestrée au chargement, puis sortie réglée sur le défilement ; rail de progression dans « Comment ça marche ».
- Règles : transform et opacity uniquement ; état caché posé en JavaScript (contenu visible sans script et à l'impression) ; aucune animation sous « réduire les animations ».

## Référencement (SEO)

- `services/seo.ts` : titre, description, adresse canonique, aperçus de partage (Open Graph, X) et robots, mis à jour à chaque page par le routeur (`meta.title`, `meta.description`, `meta.noindex`).
- Titres calqués sur les recherches réelles : « Orientation après le bac au Sénégal », « Vérifier si une école est reconnue par l’État », « [école] est-elle reconnue par l’État ? ».
- Données structurées schema.org : `Organization` et `WebSite` avec recherche (index.html), `JobPosting` pour les stages et emplois ouverts (éligibles à Google Jobs), `CollegeOrUniversity` pour les écoles, fil d’Ariane sur les fiches.
- `sitemap.xml` et `robots.txt` générés au build depuis les données (`seo.plugin.ts`) ; pages personnelles exclues et marquées `noindex`.
- Image de partage : `public/og-image.png` (1200 × 630).
- Domaine : `VITE_SITE_URL` dans `.env`, à remplacer par l’adresse définitive avant la mise en ligne.
- À prévoir en production : prérendu des pages publiques (par exemple `vite-ssg`) pour que le contenu soit dans le HTML dès le premier octet ; inscription du site dans Google Search Console avec le sitemap.

## Moteurs de règles (TDR §6.2)

- Opportunités : `score = 30·filière + 25·niveau + 15·type + 15·lieu + 15·disponibilité`, dans `services/matching.ts`.
- Orientation : `score = 35·intérêts + 25·matières + 15·métiers + 15·contraintes + 10·accessibilité`, dans `services/orientation.ts`. Les établissements non habilités ne sont jamais proposés, et l'accessibilité est donnée en fourchette.
- Modération : les demandes d'argent explicites bloquent la publication ; les mots ambigus sont signalés à l'équipe (`services/moderation.ts`).

## Qualité vérifiée

- Rendu vérifié de 360 à 1440 px, sans débordement horizontal.
- Audit axe-core sur 25 pages, à 390 et 1280 px : aucune violation hors des outils de développement.
- Poids d'une page (production) : environ 100 à 115 Ko de site et 148 Ko de polices à la première visite (mises en cache ensuite). Aucune photo : les en-têtes utilisent la couleur principale, les motifs textiles et l'illustration du réseau, tous en SVG.
- Hors ligne : après une première visite, les fiches d'école et d'offre s'affichent sans connexion.
