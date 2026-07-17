import HomeClient from './page.client'

export const metadata = {
  title: 'Jacked | Free Gym Workout Tracker with Weekly Muscle Targets',
  description: 'Jacked is a free iPhone workout tracker with weekly muscle targets, double progression, next-lift guidance, fast set logging, rest timers, and compatible Hevy import.',
  alternates: {
    canonical: 'https://jacked.coach/',
  },
}

export default function Home() {
  return <HomeClient />
}
