import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'content', 'blog')
let cachedPosts = null

function dateValue(value) {
  return value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).getTime() : 0
}

function getSearchPosts() {
  if (cachedPosts) return cachedPosts

  if (!fs.existsSync(postsDir)) {
    cachedPosts = []
    return cachedPosts
  }
  
  const files = fs.readdirSync(postsDir)
  cachedPosts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(postsDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      // Extract first 200 chars of content for search preview
      const plainContent = content
        .replace(/^#.*$/gm, '')
        .replace(/^##.*$/gm, '')
        .replace(/^###.*$/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`]/g, '')
        .slice(0, 200)
      
      return {
        slug: file.replace('.md', ''),
        title: data.title || '',
        excerpt: data.excerpt || '',
        date: data.date || '',
        content: plainContent,
        category: data.category || 'General'
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
