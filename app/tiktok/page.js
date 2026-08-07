import TikTokLandingClient from './TikTokLandingClient'

export const metadata = {
  title: 'Jacked for iPhone | Know Your Next Lift',
  description: 'Build the body you came for with a clear target for every lift and fast workout logging. Jacked is free to download on iPhone.',
  alternates: {
    canonical: 'https://jacked.coach/tiktok',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Jacked for iPhone | Know Your Next Lift',
    description: 'Stop guessing between sets. Turn your last workout into today\'s load and rep target.',
    url: 'https://jacked.coach/tiktok',
    images: ['/marketing/generated/jacked-acquisition-social.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jacked for iPhone | Know Your Next Lift',
    description: 'Stop guessing between sets. Turn your last workout into today\'s load and rep target.',
    images: ['/marketing/generated/jacked-acquisition-social.jpg'],
  },
}

export default function TikTokLandingPage() {
  return <TikTokLandingClient />
}
