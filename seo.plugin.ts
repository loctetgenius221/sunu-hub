import type { Plugin } from 'vite'
import { legalPages } from './src/data/legal.ts'
import { opportunities } from './src/data/opportunities.ts'
import { schools } from './src/data/schools.ts'

// Génère sitemap.xml et robots.txt au build, à partir des mêmes données que le site :
// une offre ou une école ajoutée apparaît d'elle-même dans le plan du site.
// Les pages personnelles (profil, espace structure, back-office) en sont exclues.

const PAGES: [path: string, priority: number, changefreq: string][] = [
  ['/', 1.0, 'daily'],
  ['/opportunites', 0.9, 'daily'],
  ['/verifier-ecole', 0.9, 'weekly'],
  ['/orienter', 0.9, 'weekly'],
  ['/orienter/questionnaire', 0.7, 'monthly'],
  ['/orienter/assistant', 0.6, 'monthly'],
  ['/structures', 0.8, 'monthly'],
  ['/structures/inscription', 0.5, 'monthly'],
  ['/inscription', 0.6, 'monthly'],
  ['/aide', 0.5, 'monthly'],
]

const PRIVATE = ['/profil', '/structures/espace', '/structures/publier', '/structures/offres/', '/orienter/pistes', '/orienter/voeux', '/orienter/resume', '/equipe']

const day = (iso: string) => iso.slice(0, 10)

export function seo(siteUrl: string): Plugin {
  const site = siteUrl.replace(/\/$/, '')
  return {
    name: 'sunu-seo',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const open = opportunities.filter((o) => new Date(o.deadline) >= new Date())
      const urls = [
        ...PAGES.map(([path, priority, changefreq]) => ({ path, priority, changefreq, lastmod: today })),
        ...open.map((o) => ({ path: `/opportunites/${o.id}`, priority: 0.8, changefreq: 'weekly', lastmod: day(o.collectedAt) })),
        ...schools.map((s) => ({ path: `/verifier-ecole/${s.id}`, priority: 0.7, changefreq: 'monthly', lastmod: day(s.verifiedAt) })),
        ...legalPages.map((p) => ({ path: `/${p.slug}`, priority: 0.3, changefreq: 'yearly', lastmod: today })),
      ]

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${site}${u.path}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority.toFixed(1)}</priority></url>`)
  .join('\n')}
</urlset>
`
      const robots = `User-agent: *
Allow: /
${PRIVATE.map((p) => `Disallow: ${p}`).join('\n')}

Sitemap: ${site}/sitemap.xml
`
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
    },
  }
}
