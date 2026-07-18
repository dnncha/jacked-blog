import { allBlogPosts } from '../../blog/posts'
let cachedPosts = null

function dateValue(value) {
  return value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).getTime() : 0
}

function getSearchPosts() {
  if (cachedPosts) return cachedPosts

  cachedPosts = allBlogPosts
    .map(post => {
      // Extract first 200 chars of content for search preview
      const plainContent = post.content
        .replace(/^#.*$/gm, '')
        .replace(/^##.*$/gm, '')
        .replace(/^###.*$/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`]/g, '')
        .slice(0, 200)
      
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        content: plainContent,
        category: post.category
      }
    })
    .sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.title.localeCompare(b.title))

  return cachedPosts
}

export async function GET() {
  return Response.json(getSearchPosts(), {
    headers: {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
