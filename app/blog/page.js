import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import BlogIndexClient from './page.client'

export const metadata = {
  title: 'Training Library',
  description: 'Search the Jacked training library for hypertrophy, progressive overload, RIR, deloads, exercise selection, recovery, supplements, and workout app guidance.',
  alternates: {
    canonical: 'https://jacked.coach/blog',
  },
  openGraph: {
    title: 'Training Library | Jacked',
    description: 'Practical hypertrophy articles and workout app guides from Jacked.',
    url: 'https://jacked.coach/blog',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jacked training library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Training Library | Jacked',
    description: 'Practical hypertrophy articles and workout app guides from Jacked.',
    images: ['/og-image.png'],
  },
}

function getPosts() {
  const postsDir = path.join(process.cwd(), 'content', 'blog')

  if (!fs.existsSync(postsDir)) {
    return []
  }

  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '')
      const fullPath = path.join(postsDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled article',
        excerpt: data.excerpt || '',
        date: data.date || '',
        category: data.category || 'General',
      }
    })
    .sort((a, b) => {
      const ad = a.date && !Number.isNaN(new Date(a.date).getTime()) ? new Date(a.date).getTime() : 0
      const bd = b.date && !Number.isNaN(new Date(b.date).getTime()) ? new Date(b.date).getTime() : 0
      return bd - ad || a.title.localeCompare(b.title)
    })
}

export default function BlogIndex() {
  const posts = getPosts()
  const categories = [...new Set(posts.map(post => post.category))].sort()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Jacked Training Library',
    description: metadata.description,
    url: 'https://jacked.coach/blog',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        url: `https://jacked.coach/blog/${post.slug}`,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogIndexClient allPosts={posts} categories={categories} />
    </>
  )
}
