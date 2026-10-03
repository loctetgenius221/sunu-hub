# Direction artistique : « Éditorial institutionnel isométrique »

Document de référence tiré de la **Proposition 1** du site vitrine de la DSI (Ministère de la Fonction publique, Sénégal, 2026). Il est écrit pour être **réutilisé tel quel dans d'autres projets** : tout ce qui est propre à la DSI est isolé dans la section 14 (« Adapter à une nouvelle marque »).

- **Stack de référence** : Vue 3 + Vite + Tailwind CSS v4, `motion` (animations), `lucide-vue-next` (icônes).
- **Fichiers sources** : `src/assets/main.css` (tokens), `src/components/*` (composants), `src/data/dsi.ts` (contenu).

---

## 1. Le principe en une phrase

> Un site qui se lit comme un **rapport institutionnel bien édité** (serif, filets, légendes de figure), animé par des **illustrations isométriques dessinées sur mesure**, avec des **aplats de couleurs franches** et des **cadres à ombre dure** qui lui donnent de la chaleur.

Ce que l'on cherche : sérieux (institution) + convivialité (illustrations, photos, ton direct). Ce que l'on évite : l'aspect « template SaaS » (dégradés pastel, cartes arrondies identiques, ombres grises douces, icônes dans des carrés).

### Les 6 marqueurs qui font reconnaître le style

1. **Titres en serif** (Newsreader), couleur de marque, jamais en gras lourd.
2. **Filets noirs épais (2 px)** qui ouvrent chaque liste et chaque section ; filets gris fins entre les lignes.
3. **Ombres dures décalées** (`10px 10px 0`) en couleur de marque, sur les photos et les boutons. Jamais d'ombre floue.
4. **Illustrations isométriques** à contour noir, faites uniquement de formes simples (cubes, cylindres, sphères, cônes).
5. **Palette stricte** : 3 couleurs de marque + blanc + gris neutres. Le noir est réservé au texte, aux filets et au pied de page.
6. **Légendes de figure** (« Figure 1. … ») et petits repères reliés par des traits pointillés : on explique les images comme dans un document.

---

## 2. Tokens (à copier dans `main.css`)

```css
@import "tailwindcss";

@theme {
  --font-display: "Newsreader", Georgia, serif;
  --font-sans: "Schibsted Grotesk", "Segoe UI", system-ui, sans-serif;

  /* Les trois couleurs de marque */
  --color-green: #009454;
  --color-yellow: #ffcc34;
  --color-red: #f43438;

  /* Neutres uniquement */
  --color-paper: #ffffff;
  --color-paper-2: #f6f6f4;   /* fond des sections alternées */
  --color-ink: #141414;       /* texte, filets, contours */
  --color-ink-soft: #5a5a5a;  /* texte secondaire */
  --color-rule: #dcdcd8;      /* filets fins */
}
```

Polices (Google Fonts) :

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Schibsted+Grotesk:wght@400..800&display=swap" rel="stylesheet">
```

### Rôle des couleurs

| Couleur | Rôle | À ne jamais faire |
|---|---|---|
| **Vert** | Couleur de structure : titres `h2`, liens, bouton principal secondaire, fond de section d'action | L'utiliser en texte de corps (contraste 3,9:1 : réservé aux grands titres) |
| **Jaune** | Chaleur et action : bouton principal, bande défilante, bande « information clé » | Du texte jaune sur blanc (illisible) |
| **Rouge** | Signal : badge, survol des lignes, point d'attention, focus clavier | Un grand aplat de fond (trop agressif) |
| **Noir `#141414`** | Texte, filets, contours des formes, pied de page | Des fonds noirs hors pied de page et bandeau photo |
| **Blanc / `paper-2`** | Fonds de page, alternés pour rythmer | Des teintes pastel des couleurs de marque |

Règle de contraste : texte blanc sur vert ou rouge **uniquement à partir de 24 px** (ou 19 px gras). Pour du texte courant sur fond coloré, utiliser le noir sur jaune, ou une **carte blanche** posée sur le fond coloré.

### Utilitaires de base (même fichier, `@layer components`)

```css
.display { font-family: var(--font-display); font-weight: 450; letter-spacing: -0.02em; line-height: 1.08; font-variation-settings: "opsz" 48; }
.h2      { font-family: var(--font-display); font-weight: 450; letter-spacing: -0.02em; line-height: 1.1; font-size: clamp(1.8rem, 3vw, 2.75rem); color: var(--color-green); }
.wrap    { margin-inline: auto; width: min(100% - 3rem, 82rem); }   /* conteneur : 82 rem max, gouttière 1,5 rem */
.grid-paper { /* quadrillage vert très léger, 72 px */
  background-image: linear-gradient(to right, rgb(0 148 84 / .09) 1px, transparent 1px),
                    linear-gradient(to bottom, rgb(0 148 84 / .09) 1px, transparent 1px);
  background-size: 72px 72px;
}
```

Base :

```css
body { font-family: var(--font-sans); font-size: 1.0625rem; line-height: 1.6; -webkit-font-smoothing: antialiased; }
:focus-visible { outline: 3px solid var(--color-red); outline-offset: 3px; }
html { scroll-behavior: smooth; }  /* désactivé sous prefers-reduced-motion */
```

---

## 3. Typographie

Deux familles, clairement distinctes :

- **Newsreader (serif)** : tous les titres, les chiffres, les noms propres mis en avant, les titres de lignes d'index. Graisse **450**, interlettrage **-0.02em**, `opsz` 48.
- **Schibsted Grotesk (sans)** : tout le reste (texte, étiquettes, boutons, légendes). Graisses 400 à 800.

Échelle utilisée :

| Usage | Taille | Détail |
|---|---|---|
| Titre d'accueil (h1) | `clamp(2rem, 3.6vw, 3.4rem)` | Serif, vert, **court** (une phrase) |
| Titre de section (h2) | `clamp(1.8rem, 3vw, 2.75rem)` | Classe `.h2` |
| Titre de bande (hero secondaire) | `clamp(1.9rem, 3.4vw, 3.1rem)` | `.display`, noir sur jaune |
| Titre de ligne d'index | 1.4 à 1.7 rem | `.display` |
| Texte d'introduction | 1.125 à 1.3 rem | `text-ink-soft`, `max-w-lg` |
| Texte courant | 1.0625 rem | Interligne 1,6 |
| Légende / note | 0.875 rem (`text-sm`) | `text-ink-soft` |

Règles :

- **Les titres restent petits.** Un titre qui occupe plus de 3 lignes à 1440 px est trop long : on raccourcit le texte plutôt que de grossir la police.
- Longueur de ligne maximale ≈ 65 caractères (`max-w-md` à `max-w-2xl`).
- Pas de mot isolé en couleur ou en italique au milieu d'un titre. Pas de petits libellés en majuscules espacées au-dessus des titres.
- Espace insécable avant `?` et `:` dans les titres (`&nbsp;`).
- Chiffres : `tabular-nums` dès qu'ils sont alignés.

---

## 4. Mise en page et rythme

### Conteneur et grille

- Conteneur `.wrap` (82 rem). Grille de **12 colonnes** sur `lg` (≥ 1024 px), une colonne en dessous.
- Alignement **à gauche** par défaut. Le centrage est exceptionnel (bandes, appels à l'action).
- Rangées d'en-tête de section : titre en `col-span-6`, texte d'appui en `col-span-4 col-start-9` aligné en bas (`lg:self-end`).

### Espacement vertical

`py-16` (mobile) → `sm:py-24` → `lg:py-28`. Ne jamais mettre 96 px de marge sur un écran de téléphone.

### Alternance des sections (le rythme du site)

On alterne **fond blanc**, **fond `paper-2`**, **bande de couleur franche**, **bandeau photo plein écran**. Deux sections de même nature ne se suivent jamais.

Ordre de la Proposition 1 (à reprendre comme squelette) :

1. **Accueil** : fond quadrillé, titre court, 2 boutons, illustration signature à droite, légende de figure.
2. **Bande défilante jaune** : mots-clés, séparés par des pastilles de couleur.
3. **Résultats** (blanc) : photo en cadre à gauche (5 col.), titre + 3 lignes illustrées à droite (7 col.).
4. **Bandeau photo plein écran** (noir + photo + phrase forte + 4 repères).
5. **Index des missions** (`paper-2`) : titre + photo en cadre, puis lignes illustrées.
6. **Bande jaune « information clé »** : photo en cadre + illustration en pastille, titre, texte, pastilles d'attributs.
7. **Organigramme** (blanc quadrillé) : arbre à traits fins, nœuds blancs, fiche d'unité.
8. **Annuaire « Qui contacter »** (blanc) : tableau illustré avec contact.
9. **Appel à l'action vert** : titre, 2 liens, photo en cadre.
10. **Pied de page noir**.

---

## 5. Composants : recettes

### 5.1 Bouton principal (pilule jaune, ombre dure)

```html
<a class="rounded-full border-2 border-ink bg-yellow px-6 py-3 font-semibold text-ink
          shadow-[4px_4px_0_var(--color-ink)] transition-all
          hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)]">
  Trouver mon interlocuteur
</a>
```

Sur fond vert, le même bouton reste jaune. Un seul bouton primaire par écran.

### 5.2 Lien secondaire (souligné, jamais de flèche « → »)

```html
<a class="font-semibold text-ink underline decoration-green decoration-2 underline-offset-8
          transition-colors hover:decoration-red">Voir l'organisation</a>
```

Sur fond sombre ou vert : `border-b-2 border-white hover:border-yellow hover:text-yellow`.

### 5.3 Cadre photo (`PhotoFrame.vue`)

Photo avec **contour noir 2 px**, **ombre dure de 10 px** dans une couleur de marque, `aspect-ratio` explicite, léger zoom (`scale-105`, 700 ms) **au survol uniquement**. Les angles restent **droits**.

```vue
<figure class="group relative border-2 border-ink bg-paper-2"
        :style="{ boxShadow: `10px 10px 0 ${shadow}`, aspectRatio: ratio }">
  <div class="absolute inset-0 overflow-hidden">
    <img :src :alt class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
         :style="{ objectPosition: position }" loading="lazy" />
  </div>
  <slot /> <!-- badge ou illustration qui peut dépasser du cadre -->
</figure>
```

Variantes : ombre **jaune** (défaut), **verte** ou **noire** selon le fond de la section. Un élément (badge rond rouge, pastille d'illustration) peut **chevaucher** le coin du cadre : `absolute -bottom-5 right-4 lg:-right-8`. Sur mobile, ne jamais dépasser du conteneur (voir §11).

### 5.4 Pastille d'attribut

```html
<li class="flex items-center gap-3 rounded-full border-2 border-ink bg-white py-2 pl-3 pr-5 font-semibold">
  <span class="h-4 w-4 rounded-full border-2 border-ink bg-green"></span>Qualité
</li>
```

### 5.5 Étiquette de section (rare)

```html
<p class="inline-block border-2 border-ink bg-white px-3 py-1 text-sm font-bold">Une responsabilité à part</p>
```

Uniquement sur fond coloré, à angles droits. Jamais sur fond blanc.

### 5.6 Ligne d'index illustrée (missions, annuaire, résultats)

Le **cœur du système** : on n'utilise pas de cartes, on utilise des **lignes** séparées par des filets.

- Liste ouverte par `border-t-2 border-ink`, lignes séparées par `border-b border-rule`.
- Colonnes (lg) : `[illustration 8–11rem] [titre serif + résumé] [contenu]`.
- Chaque item de contenu est coiffé d'un **filet de 3 px de la couleur du domaine** (`border-t-[3px]`).
- Survol (souris seulement) : fond blanc, **barre verticale de 6 px** qui se déploie à gauche (`scale-y-0 → scale-y-100`, 300 ms), illustration qui monte de 8 px.

### 5.7 Bande défilante (`MarqueeBand.vue`)

Bande jaune, `border-y-2 border-ink`, mots en serif 24–30 px, séparés par des pastilles rondes à contour noir qui **cyclent vert / jaune / rouge**. Contenu dupliqué et translaté de -50 % en boucle (38 s, linéaire), **figée** si `prefers-reduced-motion`, `aria-hidden`.

### 5.8 Bandeau photo (`PhotoBand.vue`)

Section noire plein écran (`min-h-[30rem]`), photo en fond (`opacity-80`) avec dégradé noir à gauche, **une phrase serif** en blanc (≤ 3 lignes), puis 4 repères en cadres blancs à angles droits. La photo a un **parallaxe doux** (`translateY` de -8 % à +8 % au défilement, via `scroll()` de `motion`).

### 5.9 Appel à l'action (`ClosingCta.vue`)

Section **verte**, titre blanc serif, texte `text-[1.3rem] font-medium`, bouton jaune + lien blanc, photo en cadre à ombre jaune à droite.

### 5.10 Pied de page

Fond `ink`, texte `white/75`, nom de la direction en serif 36–48 px, rappel du ministère, **liseré tricolore** ou drapeau, mention du copyright.

### 5.11 Avatar (`Avatar.vue`) et ligne de contact

- Avec photo : rond, `object-cover`, **anneau noir 2 px** (`ring-2 ring-ink`).
- Sans photo : **silhouette illustrée** (tête + épaules) blanche sur la couleur de l'unité. **Jamais de faux visage** : une photo n'est affichée que si `photo` est renseigné.
- Contact : téléphone (`tel:`) et e-mail (`mailto:`) avec icônes lucide 14–16 px, e-mail en `break-all`.

### 5.12 Organigramme

- Arbre en **traits fins** (`bg-ink/60`, 1 px), connecteurs orthogonaux qui se **tracent** à l'apparition (`scale 0 → 1`, origine haut).
- Niveau 1 : « Tutelle » (cadre blanc). Niveau 2 : la direction (cadre vert plein, **liseré tricolore** en haut). Niveau 3 : unités en cadres blancs à **bande de couleur de 6 px** en haut.
- Chaque nœud : type (« Division »), nom en serif, puis **bande responsable** (avatar + nom + titre) séparée par un filet.
- Sélection : le nœud prend la couleur de l'unité ; une **fiche** (cartouche de plan) s'affiche dessous : Unité / Rôle / Rattachement / Composition, puis ligne « Responsable » avec boutons d'appel et e-mail.
- Éléments provisoires : **cadre en pointillés** + mention de légende.

### 5.13 Légende de figure (signature du style)

Sous une illustration : « **Figure 1.** Description courte. Survolez une couche. » (`text-sm text-ink-soft`, « Figure 1. » en `font-semibold text-ink`). Au-dessus d'une liste de légendes : filet noir de 2 px.

---

## 6. Système d'illustration isométrique (`IsoArt.vue`)

Toutes les illustrations sont **générées en SVG par du code**, avec la même grammaire, ce qui garantit la cohérence.

### Règles graphiques

- Projection isométrique : unité monde = **22 px**, `K = 0.866`.
  `P(x, y, z) = [ (x − y) · K · 22 , (x + y) · 0.5 · 22 − z · 22 ]`
- **Contour noir** `#141414`, 1,6 px, jointures arrondies sur **toutes** les formes.
- Couleurs : uniquement vert, jaune, rouge, blanc. Les faces latérales sont **la couleur assombrie** : face gauche −14 %, face droite −28 % (`shade(hex, 0.14 / 0.28)`).
- Primitives : **boîte** (3 faces), **cylindre** (corps + ellipse), **sphère** (cercle + petit reflet blanc), **cône**, **ligne** (polyligne), **marquage sur une face** (SVG transformé par la matrice du plan).
- Formules : ellipse d'un disque horizontal `rx = 1.2247 · r · 22`, `ry = 0.7071 · r · 22`.
- Ordre de dessin : de l'arrière vers l'avant (peintre).
- Le `viewBox` est **calculé automatiquement** sur la boîte englobante de la scène : pas de réglage à la main.
- Aucune ombre portée, aucun dégradé.

### Catalogue (neuf scènes réutilisables)

| `kind` | Sens | Composition |
|---|---|---|
| `steps` | Progression, productivité | 3 marches (vert, jaune, rouge) + bille blanche |
| `network` | Échange, interopérabilité | 3 cubes reliés par des pointillés qui défilent |
| `orbit` | Transformation | cube vert + anneau en pointillés + sphère jaune qui orbite |
| `monitor` | Poste de travail, service | écran avec coche blanche sur fond vert |
| `bulb` | Idée, innovation | ampoule jaune sur socle vert + rayons |
| `database` | Données | 3 cylindres empilés + voyant rouge |
| `lock` | Sécurité | cadenas jaune, anse blanche, serrure noire |
| `pawns` | Utilisateurs, accompagnement | 3 pions (vert, jaune, rouge) sur plateau blanc |
| `sheets` | Administration | pile de feuilles + tampon rouge |

### Mode sobre et mode animé (`mono`, `live`)

- **`mono`** : les couleurs de marque deviennent **blanc, gris clair et gris moyen** (mêmes contours noirs, mêmes ombrages), et les accents (bille, orbiteur) passent en **encre**. À utiliser quand la section doit rester sobre, comme l'accueil (exemple : la section des trois résultats).
- **`live`** : active les **animations d'illustration en continu**, uniquement sur les scènes qui en ont :
  - `steps` : une bille **gravit les marches** (pause sur chaque marche, petits bonds entre elles, 5 s en boucle) ;
  - `network` : des **impulsions** (points d'encre) circulent le long des liaisons, en décalé (2,4 s) ;
  - `orbit` : la sphère orbite en permanence (7 s).
- Les deux modes sont **indépendants** et coupés sous `prefers-reduced-motion` (la bille reste alors sur la première marche). Usage : `<IsoArt kind="steps" mono live />`.
- Règle : n'activer `live` que sur **2 ou 3 illustrations par écran** pour ne pas fatiguer l'œil.

Pour créer une nouvelle scène : ajouter une entrée dans `scenes` (liste d'éléments `box / cyl / sph / cone / line / face / ring`), pas de SVG manuel.

### Animation des illustrations

- **Apparition** à l'entrée dans l'écran : `opacity 0→1` + `translateY(22px) scale(.92) → 0 / 1`, 0,8 s, `ease [0.22, 1, 0.36, 1]` (une fois).
- **Au survol de la ligne parente** (souris seulement) : l'illustration **monte de 8 px** (`group-hover:-translate-y-2`).
- Continus et discrets : pointillés de `network`/`bulb` qui défilent (`stroke-dashoffset`, 1,4 s), orbite de 7 s. Tous coupés sous `prefers-reduced-motion`.
- Taille : prop `scale` (0,6 dans les tableaux denses → 0,85 dans les index → 1,5 isolée).

### L'illustration signature : la vue éclatée (`HeroStack.vue`)

Pile de **5 dalles isométriques** (une par grande unité de l'organisation), colorées vert / jaune / rouge, avec :

- quadrillage blanc ou noir à 22 % sur la face supérieure ;
- **axe vertical** et emprise au sol en pointillés ;
- un **signal rouge qui pulse** sur la dalle de base (anneau blanc, 2,8 s) ;
- à l'ouverture : les dalles **se déploient depuis le socle** (une seule séquence, 1,3 s, décalage de 0,09 s par couche) ;
- **repères directement sur l'image** : un trait pointillé part du bord de chaque dalle vers son nom (bouton aligné en HTML, liseré de la couleur de la dalle). Survol d'une dalle **ou** de son nom : la dalle monte de 20 px, les autres passent à 35 %. Sur mobile (< 640 px), repères remplacés par une légende sous l'image ; au toucher, un appui bascule la dalle.

Ce motif (« la structure de l'organisation montrée comme un objet ») est la signature : à adapter à chaque nouveau client (voir §14).

---

## 7. Photographie

- **Cadrage** : personnes au travail (naturel, lumineux), jamais de poses de catalogue. Pour un contexte africain, des personnes noires comme sujets principaux.
- **Traitement** : aucune retouche colorée. Les photos vivent dans des **cadres à angles droits** avec ombre dure, ou dans le **bandeau noir** avec dégradé.
- `object-position` choisi image par image (visages dans le tiers supérieur), `loading="lazy"`, `alt` descriptif.
- **Réutiliser** la même photo avec des cadrages différents est acceptable en maquette.
- **Droits** : source libre (Unsplash, licence gratuite) en phase maquette. Éviter les photos « Unsplash+ » (payantes), et celles où figure une **marque tierce** (logo sur un vêtement). Mention « Photos provisoires » dans le pied de page tant que les vraies photos ne sont pas là.
- **Portraits de responsables** : recadrés en carré 400 × 400 sur le visage. Données fictives clairement signalées tant que les vraies informations manquent.

---

## 8. Mouvement (animations)

Principes : **peu, mais marquant**. Une séquence d'ouverture, des révélations à l'entrée dans l'écran, des réponses aux actions. Pas de fondu-glissé sur chaque section.

| Moment | Effet | Détail |
|---|---|---|
| Ouverture de la vue éclatée | Déploiement des couches | 1,3 s, décalage par couche |
| Tracé de l'organigramme | Les traits se dessinent, les nœuds apparaissent | `inView`, `stagger(0.07)` |
| Apparition des illustrations | Montée + zoom léger | une fois par illustration |
| Bandeau photo | Parallaxe doux | `scroll()` de `motion`, ±8 % |
| Bande défilante | Translation continue | 38 s, linéaire |
| Changement de fiche / d'onglet | Fondu 180 ms | `<Transition mode="out-in">` |
| Boutons | Le bouton se soulève, l'ombre grandit | `-translate`, 150–300 ms |

Courbe d'easing partout : `[0.22, 1, 0.36, 1]`. Bibliothèque : `motion` (`animate`, `inView`, `scroll`, `stagger`).

**Obligatoire** : tout est neutralisé sous `prefers-reduced-motion: reduce` (le contenu reste visible : on ne cache jamais un élément sans pouvoir l'animer ensuite).

---

## 9. Survol, toucher, clavier

- **Tous les effets de survol sont réservés aux appareils à souris.** Tailwind v4 enveloppe déjà `hover:` et `group-hover:` dans `@media (hover: hover)`. Pour tout CSS personnalisé : `@media (hover: hover) and (pointer: fine) { … }`.
- Les gestionnaires JS utilisent `pointerenter / pointerleave` avec filtre `pointerType === 'mouse'` (jamais `mouseenter`, qui reste « collant » au toucher).
- Au toucher, un survol significatif devient **un appui qui bascule** (exemple : la vue éclatée).
- **Clavier** : tout élément interactif est un vrai `<button>` ou `<a>`, focus visible (anneau rouge 3 px), `aria-pressed` / `aria-expanded` sur les bascules, `aria-live="polite"` sur les fiches qui changent.

---

## 10. Contenu et ton

- **Phrases courtes, voix active, vocabulaire de l'usager** : « Trouver mon interlocuteur », « Une panne, un projet, une idée ? » (pas « Soumettre »).
- Un bouton garde le **même nom** partout.
- Titres factuels qui disent ce que fait la section (« Qui contacter pour quoi ? »).
- Pas de références juridiques affichées à l'écran (articles, numéros de décret) ; elles restent dans les sources.
- Donnée provisoire : **toujours signalée** à l'écran (pointillés + note).
- Interlocuteur par défaut explicite (« premier point d'entrée »).

---

## 11. Responsive : règles qui évitent tout débordement

Testé de **280 à 2560 px**. Règles à respecter dans tout nouveau composant :

1. **`min-w-0` sur tout enfant de grille ou de flex** qui contient du texte (sinon la largeur minimale du contenu fait déborder).
2. Éléments qui sortent volontairement d'un cadre (badges, pastilles) : `right-4` en dessous de `lg`, `lg:-right-8` au-dessus.
3. E-mails et URL : `break-all` + `max-w-full` ; téléphones : `whitespace-nowrap`.
4. Grille imbriquée : toujours `grid-cols-1` explicite en mobile, colonne de droite en `minmax(0,1fr)`.
5. Hauteurs fixes (`h-64`) **seulement à partir de `lg`** ; en dessous, `min-h-*`.
6. Pas de `translate` négatif qui sort de l'écran sans parent `overflow-hidden`.
7. Les marges verticales descendent sur mobile (`py-16`).
8. Les décors (cercles, courbes) sont dans un parent `overflow-hidden`.

Points de rupture : `sm` 640 (repères sur la vue éclatée), `lg` 1024 (grille 12 colonnes, arbre d'organigramme à 6 colonnes).

---

## 12. Accessibilité (plancher de qualité)

- Contraste : voir §2 (blanc sur vert/rouge uniquement en grand texte).
- Focus visible partout, ordre de tabulation logique.
- `alt` sur toutes les photos ; illustrations décoratives en `aria-hidden`.
- Mouvement réduit respecté (§8). Aucune information portée uniquement par la couleur (les pastilles sont toujours accompagnées d'un libellé).
- Cibles tactiles ≥ 44 px pour les boutons et lignes de contact.

---

## 13. Ce qu'il ne faut pas faire (liste de refus)

- Cartes arrondies identiques avec ombre grise douce.
- Dégradés de couleur comme décor, fonds pastel, blobs flous.
- Icônes dans des carrés colorés pour illustrer chaque ligne (on utilise l'illustration isométrique).
- Numérotation 01 / 02 / 03 sur des contenus qui ne sont pas une séquence.
- Majuscules espacées au-dessus des titres, flèches « → » en fin de lien.
- Un mot isolé en couleur ou en italique dans un titre.
- Plus de 3 couleurs de marque, ou du noir hors texte/filets/pied de page.
- Faux visages sur des noms fictifs sans mention explicite.

---

## 14. Adapter à une nouvelle marque

Ce qui change, ce qui reste.

**Ce qui reste identique** : fonts, structure des sections, recettes de composants (§5), grammaire isométrique (§6), règles de mouvement, de survol, de responsive et d'accessibilité.

**Ce qu'on remplace** :

1. **Les 3 couleurs** : modifier `--color-green / yellow / red`. Conserver les rôles (structure / chaleur / signal). Vérifier le contraste du titre sur blanc (≥ 3:1 en grand texte). Mettre à jour `moving-border`, `.grid-paper` (les valeurs RGB du quadrillage) et les couleurs de `IsoArt`.
2. **L'illustration signature** (`HeroStack`) : la remplacer par « la structure du client montrée comme un objet » (par exemple des étages pour un hôpital, des couches pour un service technique, des dalles pour des directions). Garder : 3 à 6 éléments, couleurs alternées, repères pointillés sur l'image, survol réciproque.
3. **Les mots-clés** de la bande défilante (6 à 8 mots du métier).
4. **Le catalogue d'illustrations** : conserver les `kind` génériques, en ajouter selon le métier.
5. **Le contenu** : un fichier de données unique (`src/data/<client>.ts`) qui porte unités, missions, besoins, responsables. Aucune donnée en dur dans les composants.
6. **Les photos** : à remplacer par des photos du client dès qu'elles existent (même dossier, mêmes cadrages).

**Cas d'une marque à 2 couleurs seulement** : le rouge devient un accent rare (focus, signal), le vert et le jaune gardent leurs rôles.

---

## 15. Installation rapide dans un nouveau projet

```bash
npm create vue@latest mon-site        # TypeScript, Router
cd mon-site
npm i tailwindcss @tailwindcss/vite motion lucide-vue-next
```

1. `vite.config.ts` : ajouter le plugin `@tailwindcss/vite`.
2. Coller les tokens et utilitaires du §2 dans `src/assets/main.css`.
3. Ajouter le lien Google Fonts du §2 dans `index.html` (`<html lang="fr">`).
4. Copier depuis ce projet : `IsoArt.vue`, `HeroStack.vue`, `PhotoFrame.vue`, `PhotoBand.vue`, `MarqueeBand.vue`, `Avatar.vue`, `OrgChart.vue`, `MissionsIndex.vue`, `ContactDirectory.vue`, `ClosingCta.vue`, `SiteFooter.vue`.
5. Créer le fichier de données, brancher les composants, remplacer les photos.
6. Vérifier : débordement (§11), mouvement réduit (§8), contrastes (§2).

---

## 16. Prompt prêt à coller dans un autre projet (pour Claude)

```text
Construis le site en suivant la direction artistique « Éditorial institutionnel isométrique »
décrite dans DIRECTION-ARTISTIQUE-PROPOSITION-1.md (à lire en entier avant de commencer).

Marque : <nom>. Couleurs : vert <#...>, jaune <#...>, rouge <#...>. Contenu : <fichier de données>.
Illustration signature : <la structure du client montrée comme un objet isométrique en N éléments>.

Contraintes :
- Respecter le §13 (liste de refus) et le §11 (aucun débordement de 280 à 2560 px).
- Titres courts, serif, vert ; filets noirs 2 px ; cadres photo à ombre dure ; palette stricte.
- Survol réservé à la souris (§9), mouvement réduit respecté (§8).
- Vérifie le rendu par captures à 360, 768, 1440 px avant de conclure.
```
