import HomeClient from './page.client'

export const metadata = {
  title: 'Surpass: Progressive Overload Gym Log',
  description: 'Surpass is an iPhone gym log with live all-time PR alerts and no account. Free logging, routines, and CSV import from Hevy, Strong, and FitNotes. Surpass Pro adds next-set targets beside last time.',
  alternates: {
    canonical: 'https://jacked.coach/',
  },
  openGraph: {
    title: 'Surpass: Gym Log with Next-Set Targets',
    description: 'Beat last week. Every set shows a target beside what you lifted last time. Free on iPhone, no account required.',
    url: 'https://jacked.coach/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Surpass gym workout tracker for iPhone' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Surpass: Gym Log with Next-Set Targets',
    description: 'Free iPhone gym log with live PR alerts and on-device workout history. Surpass Pro adds next-set targets.',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  return (
    <>
      <link rel="stylesheet" href="/home.css" precedence="default" />
      <HomeClient />
    </>
  )
}
