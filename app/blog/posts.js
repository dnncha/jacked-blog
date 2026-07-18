import generatedPosts from './posts.generated.json'

export const allBlogPosts = generatedPosts

export function findBlogPost(slug) {
  return allBlogPosts.find(post => post.slug === slug) || null
}
