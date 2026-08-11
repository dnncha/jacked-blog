import { Suspense } from 'react'
import ProofClient from './proof.client'

export const metadata = {
  title: 'Workout Proof | Jacked',
  description: 'A public workout receipt shared from Jacked.',
  robots: {
    index: false,
    follow: false,
  },
}

function LoadingProof() {
  return (
    <main className="proof-shell" aria-busy="true">
      <section className="proof-card proof-state-card">
        <p className="proof-kicker">JACKED PROOF</p>
        <h1>Opening receipt…</h1>
      </section>
    </main>
  )
}

export default function ProofPage() {
  return (
    <Suspense fallback={<LoadingProof />}>
      <ProofClient />
    </Suspense>
  )
}
