import HomeClient from './page.client'

export const metadata = {
  title: 'Surpass — Get Bigger On Purpose',
  description: 'Build the body people notice with Surpass — a focused iPhone hypertrophy app for visible priorities, guided workouts, and evidence-led progression.',
  alternates: {
    canonical: 'https://jacked.coach/',
  },
}

export default function Home() {
  return <HomeClient />
}
