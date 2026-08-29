import generatedPosts from './posts.generated.json'

export const allBlogPosts = generatedPosts

export const legacyBlogSlugs = {
  'beta-ecdysterone-muscle-growth': 'beta-ecdysterone-muscle-anabolic-research',
  'creatine-loading-phase-necessary': 'creatine-loading-phase-necessary-research',
  'gut-microbiome-muscle-building-probiotics-2026': 'gut-muscle-axis-microbiome-muscle-building',
  'gut-microbiome-muscle-growth-science': 'gut-muscle-axis-microbiome-muscle-building',
  'muscle-memory-hypertrophy-detraining-science': 'muscle-memory-myonuclei-retention-science',
  'muscle-memory-detraining-science-2026': 'muscle-memory-myonuclei-retention-science',
  'muscle-memory-science-gains-faster': 'muscle-memory-myonuclei-retention-science',
  'muscle-memory-science-gains': 'muscle-memory-myonuclei-retention-science',
  'sleep-growth-hormone-circuit-2025': 'sleep-growth-hormone-brain-circuits-2026',
  'sleep-growth-hormone-circuit-muscle-building-2025': 'sleep-growth-hormone-brain-circuits-2026',
  'lean-vs-fatty-meat-2025-research': 'lean-pork-muscle-protein-synthesis-2025',
  'strong-to-jacked-import-guide': 'strong-to-surpass-import-guide',
  'import-hevy-to-jacked': 'import-hevy-to-surpass',
  'jacked-competitor-analysis-2026': 'surpass-competitor-analysis-2026',
  'mind-muscle-connection-science-gains': 'mind-muscle-connection-science',
  'psychology-muscle-building-habits': 'psychology-muscle-building-mindset-habits',
  'creatine-science-2025': 'creatine-monohydrate-science-2026',
}

export function canonicalBlogSlug(slug) {
  return legacyBlogSlugs[slug] || slug
}

// Canonical posts are the only articles that belong in discovery surfaces.
// Legacy and merged URLs remain routable for redirects and old bookmarks, but
// must not compete with their destination in the sitemap, feed, search, or
// related-article UI.
export const canonicalBlogPosts = allBlogPosts.filter(post => canonicalBlogSlug(post.slug) === post.slug)

export function findBlogPost(slug) {
  const canonicalSlug = canonicalBlogSlug(slug)
  return allBlogPosts.find(post => post.slug === canonicalSlug) || null
}
