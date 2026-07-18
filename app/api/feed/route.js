import { allBlogPosts } from '../../blog/posts'

function isValidDate(value) {
  return Boolean(value && !Number.isNaN(new Date(value).getTime()))
}

function fallbackDateForSlug(slug) {
  const match = String(slug || '').match(/20\d{2}/)
  return match ? `${match[0]}-01-01` : '2025-01-01'
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function cdata(value) {
  return `<![CDATA[${String(value || '').replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`
}

function getPosts() {
  return allBlogPosts
    .map(post => {
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: isValidDate(post.date) ? post.date : '',
        sortDate: isValidDate(post.date) ? post.date : fallbackDateForSlug(post.slug),
        category: post.category
      }
    })
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
    .slice(0, 50) // Latest 50 posts
}

export async function GET() {
  const posts = getPosts()
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jacked | Hypertrophy Training Library</title>
    <link>https://jacked.coach</link>
    <description>Hypertrophy, progressive overload, workout tracking, recovery, and supplement articles from Jacked.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://jacked.coach/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title>${cdata(post.title)}</title>
      <link>https://jacked.coach/blog/${post.slug}</link>
      <guid>https://jacked.coach/blog/${post.slug}</guid>
      ${post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ''}
      <description>${cdata(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
    </item>`).join('')}
  </channel>
</rss>`
  
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  })
}
