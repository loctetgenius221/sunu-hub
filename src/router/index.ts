import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { legalPages } from '@/data/legal'
import { setSeo } from '@/services/seo'
import { useProfileStore } from '@/stores/profile'
import { useOrientationStore } from '@/stores/orientation'
import { useStructureStore } from '@/stores/structure'

// Toute adresse inconnue mène à la page introuvable.
const placeholder = () => import('@/views/PlaceholderView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/inscription', name: 'signup', component: () => import('@/views/SignupView.vue'), meta: { title: 'Créer mon profil gratuit', description: 'Crée ton profil SUNU HŪB en deux minutes avec ton numéro de téléphone : des stages, bourses et concours triés pour ta filière, et des alertes WhatsApp.' } },
    { path: '/profil', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: 'Mon profil', requiresProfile: true, noindex: true } },
    { path: '/profil/cv', name: 'cv', component: () => import('@/views/CvView.vue'), meta: { title: 'Mon CV', requiresProfile: true, noindex: true } },
    { path: '/opportunites', name: 'opportunities', component: () => import('@/views/OpportunitiesView.vue'), meta: {
        title: 'Stages, bourses, concours et emplois au Sénégal',
        description: 'Stages, emplois juniors, bourses, concours, formations et financements pour les jeunes au Sénégal. Offres vérifiées, avec source et date limite.',
      }, },
    { path: '/opportunites/:id', name: 'opportunity', component: () => import('@/views/OpportunityView.vue'), meta: { title: 'Opportunité' } },
    {
      path: '/verifier-ecole',
      name: 'school-checker',
      component: () => import('@/views/SchoolCheckerView.vue'),
      meta: {
        title: 'Vérifier si une école est reconnue par l’État',
        description: 'Avant de payer une inscription, vérifie gratuitement si une école est habilitée au Sénégal et si ta formation est accréditée. Sources officielles.',
      },
    },
    { path: '/verifier-ecole/:id', name: 'school', component: () => import('@/views/SchoolView.vue'), meta: { title: 'Vérifier une école' } },
    { path: '/structures', name: 'structures', component: () => import('@/views/structures/StructuresView.vue'), meta: {
        title: 'Publier une offre de stage ou d’emploi gratuitement',
        description: 'Écoles, entreprises, ONG : publiez gratuitement vos stages, emplois, bourses et concours. Ils arrivent aux jeunes dont le profil correspond.',
      }, },
    { path: '/structures/inscription', name: 'structure-signup', component: () => import('@/views/structures/StructureSignupView.vue'), meta: { title: 'Créer un compte structure', description: 'Créez le compte de votre structure pour publier vos opportunités auprès des jeunes Sénégalais. Vérification sous 48 heures, publication gratuite.' } },
    { path: '/structures/espace', name: 'structure-dashboard', component: () => import('@/views/structures/StructureDashboardView.vue'), meta: { title: 'Mon espace structure', structure: 'account', noindex: true } },
    { path: '/structures/publier', name: 'structure-publish', component: () => import('@/views/structures/PublishOfferView.vue'), meta: { title: 'Publier une opportunité', structure: 'verified', noindex: true } },
    { path: '/structures/offres/:id', name: 'structure-offer', component: () => import('@/views/structures/OfferCandidatesView.vue'), meta: { title: 'Candidatures', structure: 'verified', noindex: true } },
    { path: '/orienter', name: 'orient', component: () => import('@/views/orient/OrientView.vue'), meta: {
        title: 'Orientation après le bac au Sénégal',
        description: 'Quelle formation choisir après le bac ? Un questionnaire court, trois pistes expliquées, les écoles reconnues et ta liste de vœux Campusen. Gratuit.',
      }, },
    { path: '/orienter/questionnaire', name: 'orient-quiz', component: () => import('@/views/orient/OrientQuizView.vue'), meta: { title: 'Questionnaire d’orientation gratuit', description: 'Quelques questions sur tes goûts, tes matières et tes contraintes, et SUNU HŪB te propose trois pistes de formation, avec les écoles reconnues.' } },
    { path: '/orienter/pistes', name: 'orient-results', component: () => import('@/views/orient/PistesView.vue'), meta: { title: 'Mes pistes', orientDone: true, noindex: true } },
    { path: '/orienter/voeux', name: 'orient-wishes', component: () => import('@/views/orient/WishesView.vue'), meta: { title: 'Ma liste de vœux', orientDone: true, noindex: true } },
    { path: '/orienter/resume', name: 'orient-summary', component: () => import('@/views/orient/FamilySummaryView.vue'), meta: { title: 'Résumé pour la famille', orientDone: true, noindex: true } },
    { path: '/orienter/assistant', name: 'orient-assistant', component: () => import('@/views/orient/AssistantView.vue'), meta: { title: 'Assistant d’orientation', description: 'Filières, écoles, Campusen, bourses : l’assistant intelligent répond à tes questions tout de suite, un conseiller sous 48 heures.' } },
    // Pages légales et d'information : un seul gabarit, contenu dans data/legal.ts.
    ...legalPages.map((p) => ({
      path: `/${p.slug}`,
      name: p.slug,
      component: () => import('@/views/LegalView.vue'),
      props: { slug: p.slug },
      meta: { title: p.title, description: p.description },
    })),
    { path: '/aide', name: 'help', component: () => import('@/views/HelpView.vue'), meta: { title: 'Aide et questions fréquentes', description: 'Réponses aux questions fréquentes : profil, alertes WhatsApp, orientation, vérification des écoles, offres suspectes. Contact sous 48 heures.' } },
    { path: '/equipe', name: 'admin', component: () => import('@/views/AdminView.vue'), meta: { title: 'Back-office', noindex: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: placeholder, meta: { title: 'Page introuvable', noindex: true } },
  ],
  // Un changement de filtres (même page, autre query) ne remonte pas en haut.
  // Le défilement attend la fin du fondu de sortie (150 ms) : pas de saut visible avant le changement de page.
  scrollBehavior: (to, from, saved) => {
    if (to.path === from.path) return to.hash ? { el: to.hash } : false
    const target = saved ?? (to.hash ? { el: to.hash } : { top: 0 })
    return new Promise((resolve) => setTimeout(() => resolve(target), 160))
  },
})

// Espace personnel réservé aux profils terminés ; un profil terminé n'a plus besoin de l'inscription.
router.beforeEach((to) => {
  const store = useProfileStore()
  if (to.meta.requiresProfile && !store.isRegistered) return { name: 'signup' }
  if (to.name === 'signup' && store.isRegistered && !to.query.etape) return { name: 'profile' }

  // Espace structures : un compte pour le tableau de bord, un compte vérifié pour publier.
  const structure = useStructureStore()
  if (to.meta.structure && !structure.state.account) return { name: 'structure-signup' }
  if (to.meta.structure === 'verified' && !structure.verified) return { name: 'structure-dashboard' }
  if (to.name === 'structure-signup' && structure.state.account) return { name: 'structure-dashboard' }

  // Les pistes n'existent qu'une fois le questionnaire d'orientation terminé.
  if (to.meta.orientDone && !useOrientationStore().done) return { name: 'orient-quiz' }
})

// Référencement de chaque page ; les fiches d'offre et d'école le complètent une fois chargées.
router.afterEach((to) => {
  setSeo({ title: to.meta.title, description: to.meta.description, path: to.path, noindex: to.meta.noindex })
})

export default router
