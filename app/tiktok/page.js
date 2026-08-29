import TikTokLandingClient from './TikTokLandingClient'

export const metadata = {
  title: 'Surpass for iPhone | Get Bigger On Purpose',
  description: 'Build the body people notice with a focused iPhone training system for clear sessions, honest progress evidence, and no account required.',
  alternates: {
    canonical: 'https://jacked.coach/tiktok',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Surpass for iPhone | Get Bigger On Purpose',
    description: 'Choose what you want to change. Surpass turns it into today\'s clear session, then keeps the work and the evidence close together.',
    url: 'https://jacked.coach/tiktok',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surpass for iPhone | Get Bigger On Purpose',
    description: 'Choose what you want to change. Surpass turns it into today\'s clear session, then keeps the work and the evidence close together.',
    images: ['/og-image.png'],
  },
}

export default function TikTokLandingPage() {
  return <TikTokLandingClient />
}
