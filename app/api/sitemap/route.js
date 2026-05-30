import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { tools } from '../../tools/toolData.mjs'

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
  
  const files = fs.readdirSync(postsDir)
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(postsDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      return {
        slug: file.replace('.md', ''),
        date: isValidDate(data.date) ? data.date : '',
        sortDate: isValidDate(data.date) ? data.date : fallbackDateForSlug(file)
      }
    })
    .sort((a, b) => {
      const ad = isValidDate(a.sortDate) ? new Date(a.sortDate).getTime() : 0
      const bd = isValidDate(b.sortDate) ? new Date(b.sortDate).getTime() : 0
      return bd - ad || a.slug.localeCompare(b.slug)
    })
}

export async function GET() {
  const posts = getPosts()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jacked.coach/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jacked.coach/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://jacked.coach/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://jacked.coach/support</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://jacked.coach/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://jacked.coach/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://jacked.coach/tools</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  ${tools.map(tool => `
  <url>
    <loc>https://jacked.coach/tools/${tool.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>https://jacked.coach/blog/${post.slug}</loc>
    ${post.date ? `<lastmod>${post.date}</lastmod>` : ''}
    <changefreq>${post.slug === 'alternatives-to-rp-hypertrophy-app' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${post.slug === 'alternatives-to-rp-hypertrophy-app' ? '0.95' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  })
}
