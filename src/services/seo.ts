// Référencement : une seule fonction met à jour, pour chaque page, le titre, la description,
// l'adresse canonique, les aperçus de partage (Open Graph, X) et les données structurées.
// Le routeur l'appelle à chaque navigation ; les fiches (offre, école) la rappellent une fois chargées.
import type { Opportunity, School, Structure } from '@/types'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://sunuhub.sn').replace(/\/$/, '')
export const SITE_NAME = 'SUNU HŪB'
export const DEFAULT_DESCRIPTION =
  'Orientation après le bac, stages, bourses, concours et emplois au Sénégal : des offres vérifiées, triées pour ton profil, et les écoles reconnues par l’État.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export interface Seo {
  /** Titre de la page, sans le nom du site. Vide : accueil. */
  title?: string
  description?: string
  /** Chemin canonique (sans paramètres de filtre). */
  path?: string
  noindex?: boolean
  type?: 'website' | 'article'
  /** Données structurées schema.org propres à la page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function meta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function link(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/** Description utilisable : texte simple, coupé proprement vers 160 caractères (longueur affichée par Google). */
export function clip(text: string, max = 160) {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, t.lastIndexOf(' ', max - 1))}…`
}

export function setSeo({ title, description = DEFAULT_DESCRIPTION, path = '/', noindex, type = 'website', jsonLd }: Seo) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} : orientation, stages, bourses et emplois au Sénégal`
  const url = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`
  const desc = clip(description)

  document.title = fullTitle
  meta('name', 'description', desc)
  meta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1')
  link('canonical', url)

  meta('property', 'og:type', type)
  meta('property', 'og:title', title ?? fullTitle)
  meta('property', 'og:description', desc)
  meta('property', 'og:url', url)
  meta('property', 'og:image', DEFAULT_IMAGE)
  meta('name', 'twitter:title', title ?? fullTitle)
  meta('name', 'twitter:description', desc)

  // Données propres à la page, à côté de celles du site (déclarées dans index.html).
  document.getElementById('ld-page')?.remove()
  if (jsonLd) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.id = 'ld-page'
    s.textContent = JSON.stringify(Array.isArray(jsonLd) ? { '@context': 'https://schema.org', '@graph': jsonLd } : { '@context': 'https://schema.org', ...jsonLd })
    document.head.appendChild(s)
  }
}

/**
 * Offre d'emploi ou de stage au format schema.org/JobPosting (éligible à Google Jobs).
 * Seulement pour les stages et emplois encore ouverts : une offre expirée ne doit plus être balisée.
 */
export function jobPosting(o: Opportunity & { structure: Structure }) {
  if ((o.type !== 'stage' && o.type !== 'emploi') || new Date(o.deadline) < new Date()) return null
  return {
    '@type': 'JobPosting',
    title: o.title,
    description: `<p>${o.summary}</p><ul>${o.conditions.map((c) => `<li>${c}</li>`).join('')}</ul>`,
    datePosted: o.collectedAt.slice(0, 10),
    validThrough: o.deadline,
    employmentType: o.type === 'stage' ? 'INTERN' : 'FULL_TIME',
    hiringOrganization: { '@type': 'Organization', name: o.structure.name },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: o.city, addressCountry: 'SN' } },
    ...(o.remote && { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'Sénégal' } }),
    directApply: false,
    url: `${SITE_URL}/opportunites/${o.id}`,
  }
}

/** Établissement d'enseignement supérieur au format schema.org. */
export function schoolOrganization(s: School) {
  return {
    '@type': 'CollegeOrUniversity',
    name: s.name,
    ...(s.acronym && { alternateName: s.acronym }),
    address: { '@type': 'PostalAddress', addressLocality: s.city, addressCountry: 'SN' },
    url: `${SITE_URL}/verifier-ecole/${s.id}`,
  }
}

/** Fil d'Ariane schema.org : aide les moteurs à comprendre la hiérarchie du site. */
export function breadcrumb(items: [name: string, path: string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${path}` })),
  }
}
