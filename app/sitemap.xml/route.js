import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { tools } from '../tools/toolData.mjs'

const postsDir = path.join(process.cwd(), 'content', 'blog')

function isValidDate(value) {
  return Boolean(value && !Number.isNaN(new Date(value).getTime()))
}

function fallbackDateForSlug(slug) {
  const match = String(slug || '').match(/20\d{2}/)
  return match ? `${match[0]}-01-01` : '2025-01-01'
}

function getPosts() {
  if (!fs.existsSync(postsDir)) {
    return []
  }

  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(postsDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug: file.replace('.md', ''),
        date: isValidDate(data.date) ? data.date : '',
        sortDate: isValidDate(data.date) ? data.date : fallbackDateForSlug(file),
      }
    })
    .sort((a, b) => {
      const ad = isValidDate(a.sortDate) ? new Date(a.sortDate).getTime() : 0
      const bd = isValidDate(b.sortDate) ? new Date(b.sortDate).getTime() : 0
      return bd - ad || a.slug.localeCompare(b.slug)
    })
}

function staticUrl(loc, changefreq, priority) {
  return { loc: `https://jacked.coach${loc}`, changefreq, priority }
}

export async function GET() {
  const posts = getPosts()

  const urls = [
    staticUrl('/', 'daily', '1.0'),
    staticUrl('/blog', 'weekly', '0.9'),
    staticUrl('/tools', 'weekly', '0.9'),
    staticUrl('/about', 'monthly', '0.6'),
    staticUrl('/support', 'monthly', '0.6'),
    staticUrl('/privacy', 'yearly', '0.4'),
    staticUrl('/terms', 'yearly', '0.4'),
    ...tools.map(tool => ({
      loc: `https://jacked.coach/tools/${tool.slug}`,
      changefreq: 'weekly',
      priority: '0.9',
    })),
    ...posts.map(post => ({
      loc: `https://jacked.coach/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: post.slug === 'alternatives-to-rp-hypertrophy-app' ? 'weekly' : 'monthly',
      priority: post.slug === 'alternatives-to-rp-hypertrophy-app' ? '0.95' : '0.8',
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : ''}    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
