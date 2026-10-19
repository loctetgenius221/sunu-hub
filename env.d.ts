/// <reference types="vite/client" />

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresProfile?: boolean
    structure?: 'account' | 'verified'
    orientDone?: boolean
  }
}
