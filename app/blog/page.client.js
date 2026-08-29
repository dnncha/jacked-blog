'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 36
const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=blog_hub&mt=8'
const BLOG_HUB_COPY_VERSION = 'blog_hub_promise_v2'

const seoLinks = [
  ['/blog/alternatives-to-rp-hypertrophy-app', 'Alternatives to RP Hypertrophy App'],
  ['/blog/best-hypertrophy-app-ios-review', 'Best hypertrophy app for iOS'],
  ['/blog/best-workout-app-hypertrophy-2026', 'Best workout app for hypertrophy'],
  ['/blog/progressive-overload-app-works', 'Progressive overload apps'],
  ['/blog/import-hevy-to-surpass', 'Import Hevy to Surpass'],
  ['/blog/rpe-vs-rir-autoregulation-2025', 'RPE vs RIR'],
]

function initialSearchQuery() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('search') || ''
}

function formatDate(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return ''
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export default function BlogIndexClient({ allPosts, categories }) {
  const [query, setQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const featuredPosts = useMemo(() => (
    seoLinks
      .map(([href]) => allPosts.find((post) => href.endsWith(post.slug)))
      .filter(Boolean)
      .slice(0, 3)
  ), [allPosts])

  const filtered = useMemo(() => {
    let results = allPosts
    if (selectedCategory) results = results.filter((post) => post.category === selectedCategory)
    if (query) {
      const q = query.toLowerCase().trim()
      results = results.filter((post) =>
        post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
      )
    }

    const sorted = [...results]
    if (sortBy === 'oldest') sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
    else if (sortBy === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    return sorted
  }, [allPosts, query, selectedCategory, sortBy])

  const visiblePosts = filtered.slice(0, visibleCount)
  const canLoadMore = visibleCount < filtered.length

  return (
    <div className="blog-page">
      <style>{`
        .blog-page {
          min-height: 100vh;
          background: #050505;
          color: #fff8ea;
        }

        .blog-wrap {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .blog-hero {
          padding: 76px 0 54px;
          border-bottom: 1px solid rgba(255,248,234,0.13);
          background:
            radial-gradient(circle at 72% 0%, rgba(245,185,53,0.14), transparent 34rem),
            #050505;
        }

        .blog-hero h1 {
          max-width: 850px;
          margin: 0;
          color: #fffaf0;
          font-size: clamp(3rem, 8vw, 6.2rem);
          line-height: 0.94;
          font-weight: 950;
          letter-spacing: 0;
        }

        .blog-hero p {
          max-width: 720px;
          margin: 22px 0 0;
          color: #b8b0a2;
          font-size: 1.14rem;
          line-height: 1.7;
        }

        .blog-metrics {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .blog-metrics span {
          border: 1px solid rgba(245,185,53,0.38);
          border-radius: 8px;
          padding: 10px 13px;
          color: #e2c95f;
          background: #10100f;
          font-weight: 850;
        }

        .blog-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .blog-hero-actions a {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 0 18px;
          text-decoration: none;
          font-weight: 850;
        }

        .blog-hero-actions a:first-child {
          background: #e2c95f;
          color: #11100c;
        }

        .blog-hero-actions a:last-child {
          border: 1px solid rgba(245,185,53,0.38);
          color: #e2c95f;
        }

        .blog-library {
          padding: 48px 0 88px;
          background: #f3eee2;
          color: #11100c;
        }

        .library-top {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .library-top h2 {
          margin: 0;
          color: #11100c;
          font-size: clamp(2.1rem, 5vw, 3.4rem);
          line-height: 1.05;
          letter-spacing: 0;
        }

        .library-top p {
          max-width: 760px;
          margin: 12px 0 0;
          color: #5f584d;
          font-size: 1.03rem;
          line-height: 1.65;
        }

        .library-top > span {
          color: #5f584d;
          font-weight: 850;
          white-space: nowrap;
        }

        .library-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .library-controls input,
        .library-controls select {
          min-height: 46px;
          border-radius: 8px;
          border: 1px solid #cfc5b3;
          background: #fffaf0;
          color: #11100c;
          font-size: 0.96rem;
          font-weight: 650;
        }

        .library-controls input {
          flex: 1 1 300px;
          padding: 0 14px;
        }

        .library-controls select {
          padding: 0 14px;
        }

        .category-row,
        .seo-links {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }

        .category-row button {
          min-height: 42px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid #cfc5b3;
          background: #fffaf0;
          color: #11100c;
          cursor: pointer;
          font-weight: 800;
          white-space: nowrap;
        }

        .category-row button.selected {
          border-color: #11100c;
          background: #11100c;
          color: #fffaf0;
        }

        .seo-links {
          flex-wrap: wrap;
          overflow: visible;
          margin-bottom: 24px;
        }

        .seo-links a {
          color: #11100c;
          font-weight: 820;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .featured-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin: 0 0 24px;
        }

        .featured-card {
          display: block;
          min-height: 170px;
          padding: 18px;
          border-radius: 8px;
          background: #11100c;
          color: #fffaf0;
          text-decoration: none;
        }

        .featured-card span {
          color: #e2c95f;
          font-size: 0.76rem;
          font-weight: 850;
        }

        .featured-card h3 {
          margin: 10px 0 12px;
          font-size: 1.08rem;
          line-height: 1.3;
        }

        .featured-card p {
          margin: 0;
          color: #c8c1b6;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .article-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }

        .article-card {
          color: inherit;
          text-decoration: none;
        }

        .article-card article {
          display: flex;
          flex-direction: column;
          min-height: 190px;
          height: 100%;
          border-radius: 8px;
          padding: 18px;
          border: 1px solid #d8cfbd;
          background: #fffaf0;
          transition: transform 160ms ease, border-color 160ms ease;
        }

        .article-card:hover article {
          transform: translateY(-1px);
          border-color: #11100c;
        }

        .article-card span {
          color: #756d60;
          font-weight: 850;
          font-size: 0.75rem;
          margin-bottom: 11px;
        }

        .article-card h3 {
          margin: 0 0 14px;
          color: #11100c;
          font-size: 1.04rem;
          line-height: 1.34;
        }

        .article-card p {
          margin: 0;
          color: #756d60;
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .article-card time {
          margin-top: auto;
          padding-top: 14px;
          color: #756d60;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .blog-cta {
          margin: 32px 0;
          padding: 26px;
          border-radius: 8px;
          background: #11100c;
          color: #fffaf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .blog-cta h2 {
          margin: 0 0 8px;
          font-size: 1.45rem;
          line-height: 1.15;
        }

        .blog-cta p {
          margin: 0;
          color: #c8c1b6;
          line-height: 1.55;
        }

        .blog-cta a {
          flex: 0 0 auto;
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 0 18px;
          background: #e2c95f;
          color: #11100c;
          text-decoration: none;
          font-weight: 850;
        }

        .load-more-row {
          margin-top: 28px;
          text-align: center;
        }

        .load-more-row button {
          min-height: 46px;
          padding: 0 23px;
          border-radius: 8px;
          border: 1px solid #11100c;
          background: #11100c;
          color: #fffaf0;
          cursor: pointer;
          font-weight: 850;
        }

        .library-map {
          margin-top: 34px;
          border-top: 1px solid #cfc5b3;
          border-bottom: 1px solid #cfc5b3;
        }

        .library-map summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          min-height: 58px;
          color: #11100c;
          cursor: pointer;
          font-weight: 850;
          list-style: none;
        }

        .library-map summary::-webkit-details-marker {
          display: none;
        }

        .library-map summary::after {
          content: '+';
          color: #756d60;
          font-size: 1.4rem;
          line-height: 1;
        }

        .library-map[open] summary::after {
          content: '−';
        }

        .library-map summary span:last-child {
          color: #756d60;
          font-size: 0.82rem;
          font-weight: 750;
        }

        .library-map nav {
          padding: 4px 0 24px;
        }

        .library-map-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 8px 18px;
        }

        .library-map-grid a {
          display: block;
          padding: 8px 0;
          color: #302c25;
          font-size: 0.9rem;
          line-height: 1.35;
          text-decoration: underline;
          text-decoration-color: #c2b598;
          text-underline-offset: 3px;
        }

        .library-map-grid a:hover {
          color: #11100c;
          text-decoration-color: #11100c;
        }

        .library-map-grid small {
          display: block;
          margin-bottom: 2px;
          color: #756d60;
          font-size: 0.7rem;
          font-weight: 850;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .empty-state {
          padding: 38px;
          text-align: center;
          color: #5f584d;
          font-weight: 760;
        }

        @media (max-width: 760px) {
          .blog-hero {
            padding: 56px 0 42px;
          }

          .library-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .featured-row {
            grid-template-columns: 1fr;
          }

          .blog-cta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .article-card article {
            transition: none;
          }

          .article-card:hover article {
            transform: none;
          }
        }
      `}</style>

      <section className="blog-hero">
        <div className="blog-wrap">
          <h1>Training library for smarter hypertrophy.</h1>
          <p>
            Practical articles on progressive overload, RIR, deloads, exercise selection, recovery, supplements, workout imports, and the app decisions that matter inside a real training block.
          </p>
          <div className="blog-metrics">
            <span>{allPosts.length} articles</span>
            <span>{categories.length} topics</span>
            <span>Built for Surpass lifters</span>
          </div>
          <div className="blog-hero-actions">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-global-cta="blog_hub_hero"
              data-app-store-placement="blog_hub_hero"
              data-app-store-campaign="blog_hub"
              data-experiment="blog_hub_cta"
              data-experiment-variant="outcome_v1"
              data-copy-version={BLOG_HUB_COPY_VERSION}
            >
              Start free on iPhone
            </a>
            <Link href="#library">Browse articles</Link>
          </div>
        </div>
      </section>

      <section className="blog-library" id="library">
        <div className="blog-wrap">
          <div className="library-top">
            <div>
              <h2>Find the reason behind the next set.</h2>
              <p>
                Search the Surpass library when you want the training logic behind the app: how to progress, when to hold back, what to track, and how to make imported history useful.
              </p>
            </div>
            <span>{filtered.length} matching articles</span>
          </div>

          <div className="library-controls">
            <input
              type="text"
              aria-label="Search training articles"
              placeholder="Search hypertrophy, RIR, creatine, deload..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleCount(PAGE_SIZE)
              }}
            />
            <select
              aria-label="Sort training articles"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setVisibleCount(PAGE_SIZE)
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">A-Z</option>
            </select>
          </div>

          <div className="category-row" aria-label="Filter training articles by category">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('')
                setVisibleCount(PAGE_SIZE)
              }}
              className={selectedCategory === '' ? 'selected' : ''}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setVisibleCount(PAGE_SIZE)
                }}
                className={selectedCategory === category ? 'selected' : ''}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="seo-links">
            {seoLinks.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </div>

          {featuredPosts.length > 0 && (
            <div className="featured-row" aria-label="Start here">
              {featuredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="featured-card">
                  <span>Start here</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          )}

          <div className="article-grid">
            {visiblePosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="article-card">
                <article>
                  <span>{post.category}</span>
                  <h3>{post.title}</h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  {formatDate(post.date) && <time dateTime={post.date}>{formatDate(post.date)}</time>}
                </article>
              </Link>
            ))}
          </div>

          {visiblePosts.length > 11 && (
            <section className="blog-cta">
              <div>
                <h2>Use the research while you train.</h2>
                <p>Surpass turns RIR, volume, rest timing, imports, and progress history into a faster iPhone workout log.</p>
              </div>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-global-cta="blog_hub_mid"
                data-app-store-placement="blog_hub_mid"
                data-app-store-campaign="blog_hub"
                data-experiment="blog_hub_cta"
                data-experiment-variant="outcome_v1"
                data-copy-version={BLOG_HUB_COPY_VERSION}
              >
                Start free on iPhone
              </a>
            </section>
          )}

          {canLoadMore && (
            <div className="load-more-row">
              <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                Load more articles
              </button>
            </div>
          )}

          <details className="library-map">
            <summary>
              <span>Browse the complete training library</span>
              <span>{allPosts.length} canonical guides</span>
            </summary>
            <nav aria-label="Complete training library">
              <div className="library-map-grid">
                {allPosts.map((post) => (
                  <Link key={`library-map-${post.slug}`} href={`/blog/${post.slug}`}>
                    <small>{post.category}</small>
                    {post.title}
                  </Link>
                ))}
              </div>
            </nav>
          </details>

          {filtered.length === 0 && <p className="empty-state">No articles found.</p>}
        </div>
      </section>
    </div>
  )
}
