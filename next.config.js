/** @type {import('next').NextConfig} */
const isStaticExport = process.env.JACKED_STATIC_EXPORT === '1'

const nextConfig = {
  ...(isStaticExport ? { output: 'export', trailingSlash: true } : {}),
  reactStrictMode: true,
  async redirects() {
    if (isStaticExport) return []

    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jacked-blog.vercel.app' }],
        destination: 'https://jacked.coach/:path*',
        permanent: true,
      },
      {
        source: '/blog/beta-ecdysterone-muscle-growth',
        destination: '/blog/beta-ecdysterone-muscle-anabolic-research',
        permanent: true,
      },
      {
        source: '/blog/creatine-loading-phase-necessary',
        destination: '/blog/creatine-loading-phase-necessary-research',
        permanent: true,
      },
      {
        source: '/blog/gut-microbiome-muscle-building-probiotics-2026',
        destination: '/blog/gut-muscle-axis-microbiome-muscle-building',
        permanent: true,
      },
      {
        source: '/blog/gut-microbiome-muscle-growth-science',
        destination: '/blog/gut-muscle-axis-microbiome-muscle-building',
        permanent: true,
      },
      {
        source: '/blog/muscle-memory-hypertrophy-detraining-science',
        destination: '/blog/muscle-memory-myonuclei-retention-science',
        permanent: true,
      },
      {
        source: '/blog/muscle-memory-science-gains-faster',
        destination: '/blog/muscle-memory-myonuclei-retention-science',
        permanent: true,
      },
      {
        source: '/api/feed',
        destination: '/feed.xml',
        permanent: true,
      },
    ]
  },
  async headers() {
    if (isStaticExport) return []

    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://cdn.mxpnl.com",
          "connect-src 'self' https://api-eu.mixpanel.com https://*.mixpanel.com",
          "img-src 'self' data: https://mermaid.ink https://*.vercel.app",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
    ]

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/feed',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate',
          },
        ],
      },
      {
        source: '/api/search',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mermaid.ink',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
}

module.exports = nextConfig
