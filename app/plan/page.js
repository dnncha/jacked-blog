import { Suspense } from 'react'

import PlanClient from './PlanClient'

export const metadata = {
  title: { absolute: 'Shared plan | Surpass' },
  description: 'A read-only strength-training plan shared from Surpass.',
  robots: {
    index: false,
    follow: true,
  },
}

function LoadingPlan() {
  return (
    <section className="shared-plan-shell" aria-live="polite">
      <p className="shared-plan-eyebrow">READ-ONLY PLAN SHARE</p>
      <h1>Loading shared plan…</h1>
      <p className="shared-plan-lede">A clear plan for the work ahead, shared from Surpass.</p>
    </section>
  )
}

export default function PlanPage() {
  return (
    <Suspense fallback={<LoadingPlan />}>
      <PlanClient />
    </Suspense>
  )
}
