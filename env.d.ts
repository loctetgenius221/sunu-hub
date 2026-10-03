/// <reference types="vite/client" />

import 'vue-router'
import type { SceneKind } from '@/components/art/scenes'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    phase?: number
    art?: SceneKind
    requiresProfile?: boolean
    structure?: 'account' | 'verified'
    orientDone?: boolean
  }
}
