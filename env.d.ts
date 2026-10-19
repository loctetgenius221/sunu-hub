/// <reference types="vite/client" />

import 'vue-router'

interface ImportMetaEnv {
  /** Adresse publique du site, sans barre finale (ex. https://sunuhub.sn). */
  readonly VITE_SITE_URL?: string
  /** Numéro WhatsApp du service, format international sans « + » (ex. 221771234567). */
  readonly VITE_WHATSAPP_NUMBER?: string
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** Description pour les moteurs de recherche et les aperçus de partage (≈ 150 caractères). */
    description?: string
    /** Page personnelle ou utilitaire : exclue des résultats de recherche. */
    noindex?: boolean
    requiresProfile?: boolean
    structure?: 'account' | 'verified'
    orientDone?: boolean
  }
}
