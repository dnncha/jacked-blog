import Link from 'next/link'
import { notFound } from 'next/navigation'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { relatedToolsForArticle } from '../../tools/toolSeo.mjs'
import { allBlogPosts, findBlogPost } from '../posts'

function isValidDate(value) {
  return Boolean(value && !Number.isNaN(new Date(value).getTime()))
}

function fallbackDateForSlug(slug) {
  const match = String(slug || '').match(/20\d{2}/)
  return match ? `${match[0]}-01-01` : '2025-01-01'
}

function metaDescription(value) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text
}

function metaKeywords(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function entityList(value) {
  return metaKeywords(value)
}

function rankingItems(value) {
  return String(value || '')
    .split(';')
    .map(item => {
      const [name = '', bestFor = '', tradeoff = ''] = item.split('|').map(part => part.trim())
      return name && bestFor ? { name, bestFor, tradeoff } : null
    })
    .filter(Boolean)
}

function formatDate(value) {
  if (!isValidDate(value)) return null
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function readingTime(markdown) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

function slugifyHeading(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'section'
}

function extractHeadings(markdown) {
  const seen = new Map()
  return normalizeMarkdown(markdown)
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
    .map(line => {
      const match = line.match(/^(#{2,3})\s+(.+)$/)
      if (!match) return null
      const depth = match[1].length
      const text = match[2]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`]/g, '')
        .trim()
      const base = slugifyHeading(text)
      const count = seen.get(base) || 0
      seen.set(base, count + 1)
      return {
        id: count ? `${base}-${count + 1}` : base,
        text,
        depth,
      }
    })
    .filter(Boolean)
    .slice(0, 14)
}

function plainText(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractFaqs(markdown) {
  const content = normalizeMarkdown(markdown)
  const faqStart = content.search(/^## FAQ\s*$/im)
  if (faqStart === -1) return []

  const faqContent = content.slice(faqStart).replace(/^## FAQ\s*$/im, '')
  const sections = faqContent.split(/^###\s+/m).slice(1)

  return sections.map(section => {
    const [questionLine = '', ...answerLines] = section.split('\n')
    const question = plainText(questionLine)
    const answer = plainText(answerLines.join('\n').replace(/^##\s+[\s\S]*$/m, ''))
    return question && answer ? { question, answer } : null
  }).filter(Boolean).slice(0, 8)
}

function addHeadingIds(html) {
  const seen = new Map()
  return html.replace(/<h([23])>(.*?)<\/h\1>/g, (match, depth, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    const base = slugifyHeading(text)
    const count = seen.get(base) || 0
    seen.set(base, count + 1)
    const id = count ? `${base}-${count + 1}` : base
    return `<h${depth} id="${id}">${inner}</h${depth}>`
  })
}

function diagramBlock(title, body) {
  return `
<div class="diagram callout-diagram">
  <h4>${title}</h4>
  <p>${body}</p>
</div>
`
}

function normalizeMarkdown(content) {
  return content
    .replace(/^\s*# .+\n\n?/, '')
    .replace(/\{\{hormone-cascade\}\}/g, diagramBlock('Hormonal response cascade', 'Training stress, recovery, nutrition, and sleep interact over time. Treat hormones as context, not a single switch for muscle growth.'))
    .replace(/\{\{recovery-pyramid\}\}/g, diagramBlock('Recovery priority pyramid', 'Sleep, calories, protein, and sensible training load usually matter more than recovery gadgets or supplement tweaks.'))
    .replace(/\{\{mps-timeline\}\}/g, diagramBlock('Muscle protein synthesis timeline', 'Resistance training raises the signal for muscle repair and growth, but the practical goal is still repeatable high-quality training plus enough protein.'))
    .replace(/\{\{stress-balance\}\}/g, diagramBlock('Stress and adaptation balance', 'A useful program applies enough stress to adapt, then manages fatigue so performance can recover and progress can continue.'))
    .replace(/\{\{[^}]+\}\}/g, '')
}

async function parseContent(content) {
  const mermaidBlocks = []
  let mermaidIndex = 0

  const contentWithMarkers = normalizeMarkdown(content).replace(/```mermaid\n([\s\S]*?)```/g, (match, code) => {
    const index = mermaidIndex++
    const encoded = Buffer.from(code.trim()).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    mermaidBlocks.push(encoded)
    return `<<MERMAID-IMG-${index}>>`
  })

  const withDiagrams = contentWithMarkers.replace(/<<MERMAID-IMG-(\d+)>>/g, (match, index) => {
    const encoded = mermaidBlocks[index]
    return `<img src="https://mermaid.ink/img/${encoded}" alt="Training concept diagram for this article" class="mermaid-diagram" loading="lazy" />`
  })

  return addHeadingIds(String(await remark().use(remarkHtml, { sanitize: false }).process(withDiagrams)))
}

function getPost(slug) {
  const source = findBlogPost(slug)
  if (!source) return null

  return {
    slug,
    title: source.title,
    excerpt: source.excerpt,
    date: isValidDate(source.date) ? source.date : '',
    category: source.category,
    keywords: metaKeywords(source.keywords),
    entities: entityList(source.entities),
    rankingItems: rankingItems(source.rankingItems),
    content: source.content,
  }
}

function getPosts() {
  return allBlogPosts
    .map(source => {
      const { slug } = source
      const post = getPost(slug)
      return {
        slug,
        title: post?.title || '',
        date: post?.date || fallbackDateForSlug(slug),
        category: post?.category || 'General',
        excerpt: post?.excerpt || '',
      }
    })
    .sort((a, b) => {
      const ad = isValidDate(a.date) ? new Date(a.date).getTime() : 0
      const bd = isValidDate(b.date) ? new Date(b.date).getTime() : 0
      return bd - ad || a.title.localeCompare(b.title)
    })
}

function relatedPosts(posts, currentSlug, currentTitle, currentExcerpt, currentCategory) {
  const terms = new Set(
    `${currentTitle || ''} ${currentExcerpt || ''}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(w => w.length > 3)
  )

  return posts
    .filter(p => p.slug !== currentSlug)
    .map(p => {
      const hay = `${p.title || ''} ${p.excerpt || ''}`.toLowerCase()
      let overlap = 0
      for (const t of terms) {
        if (hay.includes(t)) overlap++
      }
      const categoryBoost = p.category === currentCategory ? 4 : 0
      return { ...p, _score: overlap + categoryBoost }
    })
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score || a.title.localeCompare(b.title))
    .slice(0, 4)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const publishedTime = isValidDate(post.date) ? post.date : undefined
  const description = metaDescription(post.excerpt)

  return {
    title: post.title,
    description,
    ...(post.keywords.length ? { keywords: post.keywords } : {}),
    alternates: {
      canonical: `https://jacked.coach/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `https://jacked.coach/blog/${slug}`,
      publishedTime,
      modifiedTime: publishedTime,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${post.title} | Jacked`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: ['/og-image.png'],
    },
  }
}

export async function generateStaticParams() {
  return allBlogPosts.map(post => ({ slug: post.slug }))
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const content = await parseContent(post.content)
  const headings = extractHeadings(post.content)
  const allPosts = relatedPosts(getPosts(), slug, post.title, post.excerpt, post.category)
  const shareUrl = `https://jacked.coach/blog/${slug}`
  const shareText = encodeURIComponent(post.title)
  const displayDate = formatDate(post.date)
  const minutesToRead = readingTime(post.content)
  const wordCount = post.content.split(/\s+/).filter(Boolean).length
  const publishedDate = isValidDate(post.date) ? post.date : undefined
  const articleTools = relatedToolsForArticle(post, 4)
  const faqs = extractFaqs(post.content)
  const rankedAlternatives = post.rankingItems.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    description: [item.bestFor, item.tradeoff ? `Tradeoff: ${item.tradeoff}` : ''].filter(Boolean).join('. '),
  }))

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jacked.coach/' },
    { '@type': 'ListItem', position: 2, name: 'Training Library', item: 'https://jacked.coach/blog' },
    { '@type': 'ListItem', position: 3, name: post.title, item: shareUrl },
  ]
  const jsonLd = JSON.parse(JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${shareUrl}#webpage`,
        url: shareUrl,
        name: post.title,
        description: metaDescription(post.excerpt),
        breadcrumb: { '@id': `${shareUrl}#breadcrumb` },
      },
      {
        '@type': 'BlogPosting',
        '@id': `${shareUrl}#article`,
        mainEntityOfPage: { '@id': `${shareUrl}#webpage` },
        headline: post.title,
        description: metaDescription(post.excerpt),
        datePublished: publishedDate,
        dateModified: publishedDate,
        isAccessibleForFree: true,
        wordCount,
        articleSection: post.category,
        about: ['hypertrophy training', 'progressive overload', 'workout tracking', post.category].filter(Boolean),
        author: {
          '@type': 'Organization',
          name: 'Jacked',
          url: 'https://jacked.coach/about',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Jacked',
          logo: {
            '@type': 'ImageObject',
            url: 'https://jacked.coach/og-image.png',
          },
        },
        image: 'https://jacked.coach/og-image.png',
        mentions: [
          ...post.entities.map(entity => ({
            '@type': 'Thing',
            name: entity,
          })),
          ...articleTools.map(tool => ({
            '@type': 'WebApplication',
            name: tool.name,
            url: `https://jacked.coach/tools/${tool.slug}`,
            applicationCategory: 'HealthApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          })),
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${shareUrl}#breadcrumb`,
        itemListElement: breadcrumbItems,
      },
      rankedAlternatives.length > 0 ? {
        '@type': 'ItemList',
        '@id': `${shareUrl}#ranked-alternatives`,
        name: `Best ${post.title}`,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: rankedAlternatives.length,
        itemListElement: rankedAlternatives,
      } : null,
      faqs.length > 0 ? {
        '@type': 'FAQPage',
        '@id': `${shareUrl}#faq`,
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      } : null,
    ].filter(Boolean),
  }))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem', background: '#000000', minHeight: '100vh', color: '#e5e5e5' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        body { background: #000000 !important; }
        .diagram {
          margin: 2rem 0;
          padding: 1.2rem 1.35rem;
          background: #10100f;
          border-radius: 12px;
          border: 1px solid #333;
        }
        .diagram h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.05rem;
          color: #d9c26c;
          font-weight: 700;
        }
        .diagram p {
          margin: 0;
          color: #c8c1b6;
          line-height: 1.65;
        }
        .mermaid-diagram {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 2rem auto;
          border-radius: 8px;
        }
        article h2 {
          color: #f2eee4;
          font-weight: 720;
          margin-top: 2.75rem;
          border-left: 3px solid #d9c26c;
          padding-left: 1rem;
          line-height: 1.25;
        }
        article h3 {
          color: #e5e5e5;
          font-weight: 700;
          margin-top: 2rem;
        }
        article p {
          color: #ccc !important;
          line-height: 1.82;
        }
        article a {
          color: #d9c26c;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        article strong {
          color: #fff;
        }
        article ul, article ol {
          color: #ccc;
          padding-left: 1.5rem;
          margin: 1.1rem 0;
        }
        article li {
          color: #ccc;
          margin-bottom: 0.55rem;
          line-height: 1.65;
        }
        article blockquote {
          border-left: 3px solid #d9c26c;
          padding-left: 1rem;
          margin-left: 0;
          color: #aaa;
          font-style: italic;
        }
        article code {
          background: #222;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }
        article pre {
          background: #111;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
        }
        article table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        article th, article td {
          border: 1px solid #333;
          padding: 0.75rem;
          text-align: left;
        }
        article th {
          background: #1a1a1a;
          font-weight: 600;
        }
        article img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1rem 0;
        }
        .article-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .article-meta span {
          border: 1px solid #333;
          border-radius: 999px;
          color: #aaa;
          padding: 0.28rem 0.65rem;
          font-size: 0.78rem;
          font-weight: 650;
        }
        .article-tools {
          margin: 0 0 2rem;
          padding: 1rem;
          border: 1px solid #333;
          border-radius: 12px;
          background: #10100f;
        }
        .article-tools h2 {
          margin: 0 0 0.35rem;
          color: #f7f2e8;
          font-size: 1rem;
          font-weight: 720;
        }
        .article-tools p {
          margin: 0 0 0.85rem;
          color: #9f988c;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .article-tool-links {
          display: flex;
          gap: 0.55rem;
          flex-wrap: wrap;
        }
        .article-tool-links a {
          color: #111;
          background: #e2c95f;
          border-radius: 8px;
          padding: 0.48rem 0.7rem;
          font-size: 0.82rem;
          font-weight: 720;
          text-decoration: none;
        }
      `}</style>

      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', color: '#8f897c', fontSize: '0.86rem', fontWeight: 650 }}>
        <Link href="/" style={{ color: '#d9c26c', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/blog" style={{ color: '#d9c26c', textDecoration: 'none' }}>Training Library</Link>
        <span>/</span>
        <span aria-current="page">{post.category}</span>
      </nav>

      <header style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5.8vw, 3rem)', fontWeight: '760', marginBottom: '0.75rem', lineHeight: '1.12', color: '#f7f2e8', letterSpacing: 0 }}>
          {post.title}
        </h1>
        <p style={{ margin: '0 0 1rem', color: '#bcb6a8', fontSize: '1.05rem', lineHeight: 1.65 }}>
          {post.excerpt}
        </p>
        <div className="article-meta">
          <span>{post.category}</span>
          {displayDate && <span>Published {displayDate}</span>}
          <span>{minutesToRead} min read</span>
          <span>Jacked training guide</span>
        </div>
        <a
          href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach&mt=8"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '1rem', padding: '0.65rem 0.95rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '720', background: '#e2c95f', color: '#111' }}
        >
          Get Jacked for iPhone
        </a>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #333' }}>
        <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 0.9rem', background: '#000000', color: '#d9c26c', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: '650', border: '1px solid #333' }}>Share on X</a>
      </div>

      {articleTools.length > 0 && (
        <section className="article-tools">
          <h2>Use the matching Jacked tool</h2>
          <p>Run the numbers from this topic, then use the result in your next session.</p>
          <div className="article-tool-links">
            {articleTools.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} data-related-tool={tool.slug}>{tool.name}</Link>
            ))}
          </div>
        </section>
      )}

      {headings.length > 2 && (
        <nav aria-label="Table of contents" style={{ margin: '0 0 2rem', padding: '1rem', border: '1px solid #333', borderRadius: '12px', background: '#10100f' }}>
          <h2 style={{ margin: '0 0 0.75rem', color: '#f7f2e8', fontSize: '1rem', fontWeight: 760 }}>Contents</h2>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#c8c1b6' }}>
            {headings.map(heading => (
              <li key={heading.id} style={{ margin: '0.3rem 0 0.3rem', paddingLeft: heading.depth === 3 ? '0.7rem' : 0 }}>
                <a href={`#${heading.id}`} style={{ color: heading.depth === 3 ? '#a9a294' : '#d9c26c', textDecoration: 'none', fontSize: heading.depth === 3 ? '0.9rem' : '0.95rem', fontWeight: heading.depth === 3 ? 600 : 720 }}>
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <article style={{ lineHeight: '1.9', fontSize: '1.08rem', color: '#ccc' }}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {allPosts.length > 0 && (
        <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #333' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: '750', color: '#ffffff' }}>Related Articles</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allPosts.map(related => (
              <Link key={related.slug} href={`/blog/${related.slug}`} style={{ display: 'block', padding: '1rem', background: '#1a1a1a', borderRadius: '10px', textDecoration: 'none', color: 'inherit', border: '1px solid #333' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '650', color: '#d9c26c' }}>{related.title}</h3>
                {related.excerpt && <p style={{ margin: '0.35rem 0 0', color: '#aaa', fontSize: '0.88rem', lineHeight: 1.5 }}>{related.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: '3rem', padding: '1.6rem', background: '#f2eee4', borderRadius: '10px', color: '#111', textAlign: 'center' }}>
        <h2 style={{ marginTop: 0, fontSize: '1.28rem', fontWeight: '760', letterSpacing: 0 }}>Apply this in your next workout.</h2>
        <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#4b473f' }}>Jacked turns plan targets, rest timing, RIR feedback, Hevy import, and progress history into a faster iPhone workout log.</p>
        <a href="https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=jacked_coach&mt=8" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.8rem 1.25rem', background: '#111', color: '#f7f2e8', borderRadius: '8px', textDecoration: 'none', fontWeight: '720' }}>
          Open the App Store listing
        </a>
      </section>
    </div>
  )
}
