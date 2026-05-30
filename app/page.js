import HomeClient from './page.client'

export const metadata = {
  title: 'Jacked | Hypertrophy Workout Tracker & Planner with Next-Set Targets',
  description: 'Jacked is an iPhone hypertrophy tracker for lifters who want fast set logging, next-set targets, RIR-aware progression, rest timers, Hevy import, progress photos, and body metrics.',
  alternates: {
    canonical: 'https://jacked.coach/',
  },
}

export default function Home() {
  return <HomeClient />
}
