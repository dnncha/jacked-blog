import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const projectRoot = process.cwd()
const postsDir = path.join(projectRoot, 'content', 'blog')
const outputPath = path.join(projectRoot, 'app', 'blog', 'posts.generated.json')

const posts = fs.readdirSync(postsDir)
  .filter(file => file.endsWith('.md'))
  .sort()
  .map(file => {
    const slug = file.replace(/\.md$/, '')
    const { data, content } = matter(fs.readFileSync(path.join(postsDir, file), 'utf8'))
    const date = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date || '')

    return {
      slug,
      title: data.title || 'Untitled article',
      excerpt: data.excerpt || '',
      date,
      category: data.category || 'General',
      keywords: data.keywords || '',
      entities: data.entities || '',
      rankingItems: data.rankingItems || '',
      content,
    }
  })

fs.writeFileSync(outputPath, `${JSON.stringify(posts)}\n`)
console.log(`Generated ${posts.length} blog posts for the application bundle.`)
