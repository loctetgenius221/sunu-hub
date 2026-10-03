import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useProfileStore } from '@/stores/profile'
import { useOrientationStore } from '@/stores/orientation'
import { useStructureStore } from '@/stores/structure'

// Les pages pas encore construites pointent vers PlaceholderView (meta.phase = étape du plan).
const placeholder = () => import('@/views/PlaceholderView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/inscription', name: 'signup', component: () => import('@/views/SignupView.vue'), meta: { title: 'Créer mon profil' } },
    { path: '/profil', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: 'Mon profil', requiresProfile: true } },
    { path: '/profil/cv', name: 'cv', component: () => import('@/views/CvView.vue'), meta: { title: 'Mon CV', requiresProfile: true } },
    { path: '/opportunites', name: 'opportunities', component: () => import('@/views/OpportunitiesView.vue'), meta: { title: 'Opportunités' } },
    { path: '/opportunites/:id', name: 'opportunity', component: () => import('@/views/OpportunityView.vue'), meta: { title: 'Opportunité' } },
    { path: '/verifier-ecole', name: 'school-checker', component: () => import('@/views/SchoolCheckerView.vue'), meta: { title: 'Vérifier une école' } },
    { path: '/verifier-ecole/:id', name: 'school', component: () => import('@/views/SchoolView.vue'), meta: { title: 'Vérifier une école' } },
    { path: '/structures', name: 'structures', component: () => import('@/views/structures/StructuresView.vue'), meta: { title: 'Espace structures' } },
    { path: '/structures/inscription', name: 'structure-signup', component: () => import('@/views/structures/StructureSignupView.vue'), meta: { title: 'Compte structure' } },
    { path: '/structures/espace', name: 'structure-dashboard', component: () => import('@/views/structures/StructureDashboardView.vue'), meta: { title: 'Mon espace structure', structure: 'account' } },
    { path: '/structures/publier', name: 'structure-publish', component: () => import('@/views/structures/PublishOfferView.vue'), meta: { title: 'Publier une opportunité', structure: 'verified' } },
    { path: '/structures/offres/:id', name: 'structure-offer', component: () => import('@/views/structures/OfferCandidatesView.vue'), meta: { title: 'Candidatures', structure: 'verified' } },
    { path: '/orienter', name: 'orient', component: () => import('@/views/orient/OrientView.vue'), meta: { title: 'Orienter' } },
    { path: '/orienter/questionnaire', name: 'orient-quiz', component: () => import('@/views/orient/OrientQuizView.vue'), meta: { title: 'Questionnaire d’orientation' } },
    { path: '/orienter/pistes', name: 'orient-results', component: () => import('@/views/orient/PistesView.vue'), meta: { title: 'Mes pistes', orientDone: true } },
    { path: '/orienter/voeux', name: 'orient-wishes', component: () => import('@/views/orient/WishesView.vue'), meta: { title: 'Ma liste de vœux', orientDone: true } },
    { path: '/orienter/resume', name: 'orient-summary', component: () => import('@/views/orient/FamilySummaryView.vue'), meta: { title: 'Résumé pour la famille', orientDone: true } },
    { path: '/orienter/assistant', name: 'orient-assistant', component: () => import('@/views/orient/AssistantView.vue'), meta: { title: 'Assistant d’orientation' } },
    { path: '/equipe', name: 'admin', component: () => import('@/views/AdminView.vue'), meta: { title: 'Back-office' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: placeholder, meta: { title: 'Page introuvable', art: 'signpost' } },
  ],
  // Un changement de filtres (même page, autre query) ne remonte pas en haut.
  scrollBehavior: (to, from, saved) => saved ?? (to.hash ? { el: to.hash } : to.path === from.path ? false : { top: 0 }),
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

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · SUNU HŪB` : 'SUNU HŪB'
})

export default router
