export function sharedToolUrl(origin, toolSlug) {
  const url = new URL(`/tools/${toolSlug}`, origin)
  url.searchParams.set('utm_source', 'tool_share')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', toolSlug)
  return url.toString()
}
