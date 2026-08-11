'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=proof_public&mt=8'
const PROOF_KINDS = new Set(['workout', 'build', 'strength'])
const VERIFICATION_LABELS = {
  app_recorded: 'Recorded in Jacked',
  imported: 'Imported history',
  manual: 'Manual entry',
}

function decodeBase64URL(value) {
  if (!value || value.length > 2400 || !/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('invalid payload')
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, character => character.charCodeAt(0))
}

async function digestPrefix(bytes) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))
  return Array.from(digest.slice(0, 8), value => value.toString(16).padStart(2, '0')).join('')
}

function cleanText(value, limit) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, limit)
}

function validateProof(candidate) {
  if (!candidate || candidate.v !== 1 || !PROOF_KINDS.has(candidate.k)) throw new Error('unsupported receipt')
  if (!Number.isFinite(candidate.d) || candidate.d < 0) throw new Error('invalid date')
  if (!VERIFICATION_LABELS[candidate.s]) throw new Error('invalid source')

  const headline = cleanText(candidate.h, 90)
  if (!headline) throw new Error('missing headline')

  const evidence = Array.isArray(candidate.e)
    ? candidate.e.slice(0, 4).map(row => ({
        label: cleanText(row?.label, 42),
        value: cleanText(row?.value, 64),
      })).filter(row => row.label && row.value)
    : []

  return {
    kind: candidate.k,
    createdAt: new Date(candidate.d * 1000),
    headline,
    buildName: cleanText(candidate.b, 64),
    evidence,
    nextAction: cleanText(candidate.n, 100),
    verification: candidate.s,
  }
}

function kindLabel(kind) {
  if (kind === 'build') return 'BUILD PROOF'
  if (kind === 'strength') return 'STRENGTH PROOF'
  return 'WORKOUT PROOF'
}

function track(name, properties) {
  window.mixpanel?.track?.(name, properties)
}

export default function ProofClient() {
  const searchParams = useSearchParams()
  const payload = searchParams.get('p') || ''
  const checksum = searchParams.get('c') || ''
  const [state, setState] = useState({ status: 'loading', proof: null })

  const appURL = useMemo(() => {
    if (!payload || !checksum) return ''
    return `jacked://proof?p=${encodeURIComponent(payload)}&c=${encodeURIComponent(checksum)}&utm_source=proof_public&utm_medium=web`
  }, [payload, checksum])

  useEffect(() => {
    let active = true

    async function load() {
      try {
        if (!/^[a-f0-9]{16}$/.test(checksum)) throw new Error('invalid checksum')
        const bytes = decodeBase64URL(payload)
        if (await digestPrefix(bytes) !== checksum) throw new Error('checksum mismatch')
        const decoded = JSON.parse(new TextDecoder().decode(bytes))
        const proof = validateProof(decoded)
        if (!active) return
        setState({ status: 'ready', proof })
        track('proof_viewed', {
          proof_type: proof.kind,
          surface: 'public_web',
          verification_state: proof.verification,
        })
      } catch {
        if (!active) return
        setState({ status: 'invalid', proof: null })
      }
    }

    load()
    return () => { active = false }
  }, [payload, checksum])

  if (state.status === 'loading') {
    return (
      <main className="proof-shell" aria-busy="true">
        <section className="proof-card proof-state-card">
          <p className="proof-kicker">JACKED PROOF</p>
          <h1>Opening receipt…</h1>
        </section>
        <ProofStyles />
      </main>
    )
  }

  if (state.status === 'invalid') {
    return (
      <main className="proof-shell">
        <section className="proof-card proof-state-card">
          <p className="proof-kicker">JACKED PROOF</p>
          <h1>This receipt cannot be verified.</h1>
          <p>The link may be incomplete, damaged, or from an unsupported version of Jacked.</p>
          <a className="proof-button proof-button-primary" href={APP_STORE_URL} data-global-cta="invalid_proof_store" data-app-store-placement="invalid_proof" data-app-store-campaign="proof_public">
            View Jacked on the App Store
          </a>
        </section>
        <ProofStyles />
      </main>
    )
  }

  const proof = state.proof

  return (
    <main className="proof-shell">
      <section className="proof-card" aria-label="Shared Jacked proof receipt">
        <header className="proof-header">
          <div>
            <p className="proof-kicker">{kindLabel(proof.kind)}</p>
            <p className="proof-date">{proof.createdAt.toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
          </div>
          <img className="proof-mark" src="/apple-touch-icon.png" alt="Jacked" width="48" height="48" />
        </header>

        <div className="proof-hero">
          <h1>{proof.headline}</h1>
          {proof.buildName ? <p className="proof-build">{proof.buildName}</p> : null}
        </div>

        <div className="proof-evidence" aria-label="Shared evidence">
          <p className="proof-section-label">EVIDENCE</p>
          {proof.evidence.length ? proof.evidence.map((row, index) => (
            <div className="proof-row" key={`${row.label}-${index}`}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          )) : <p className="proof-muted">No public evidence rows were included.</p>}
          {proof.nextAction ? <p className="proof-next">{proof.nextAction}</p> : null}
        </div>

        <div className="proof-source">
          <strong>{VERIFICATION_LABELS[proof.verification]}</strong>
          <p>This receipt contains only the fields selected for public sharing. Its checksum detects a damaged link; it is not independent verification of the lift.</p>
        </div>

        <div className="proof-actions">
          <a
            className="proof-button proof-button-primary"
            href={appURL}
            onClick={() => track('proof_deep_link_opened', { proof_type: proof.kind, source: 'public_web' })}
          >
            Open in Jacked
          </a>
          <a className="proof-button proof-button-secondary" href={APP_STORE_URL} data-global-cta="proof_store" data-app-store-placement="proof_public" data-app-store-campaign="proof_public">
            Get Jacked
          </a>
        </div>

        <footer className="proof-footer">
          <strong>JACKED</strong>
          <span>Get bigger on purpose.</span>
        </footer>
      </section>
      <ProofStyles />
    </main>
  )
}

function ProofStyles() {
  return <style jsx global>{`
    .proof-shell {
      min-height: calc(100vh - 72px);
      display: grid;
      place-items: center;
      padding: clamp(24px, 6vw, 72px) 18px;
      background:
        radial-gradient(circle at 50% 0%, rgba(234, 216, 120, 0.12), transparent 34rem),
        #050505;
      color: #f5f3ec;
    }
    .proof-card {
      width: min(100%, 640px);
      overflow: hidden;
      padding: clamp(24px, 5vw, 42px);
      border: 1px solid rgba(234, 216, 120, 0.24);
      border-radius: 26px;
      background: linear-gradient(155deg, rgba(27, 27, 24, 0.98), rgba(10, 10, 9, 0.99));
      box-shadow: 0 34px 100px rgba(0, 0, 0, 0.55);
    }
    .proof-header,
    .proof-row,
    .proof-footer,
    .proof-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .proof-kicker,
    .proof-section-label {
      margin: 0;
      color: #ead878;
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.16em;
    }
    .proof-date,
    .proof-muted {
      margin: 7px 0 0;
      color: #8d887e;
      font-size: 0.88rem;
    }
    .proof-mark {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 0 0 1px rgba(234, 216, 120, 0.28);
    }
    .proof-hero { padding: 44px 0 32px; }
    .proof-hero h1,
    .proof-state-card h1 {
      margin: 0;
      max-width: 560px;
      color: #fff;
      font-size: clamp(2.25rem, 8vw, 4rem);
      line-height: 0.98;
      letter-spacing: -0.055em;
    }
    .proof-build {
      display: inline-flex;
      margin: 22px 0 0;
      padding: 8px 12px;
      border: 1px solid rgba(234, 216, 120, 0.26);
      border-radius: 999px;
      background: rgba(234, 216, 120, 0.08);
      color: #ded6c2;
      font-size: 0.86rem;
      font-weight: 700;
    }
    .proof-evidence {
      padding: 22px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.035);
    }
    .proof-section-label { color: #8d887e; }
    .proof-row {
      padding: 17px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .proof-row span { color: #aaa397; }
    .proof-row strong { color: #fff; text-align: right; }
    .proof-next {
      margin: 19px 0 0;
      color: #ead878;
      font-weight: 760;
      line-height: 1.45;
    }
    .proof-source {
      margin: 18px 0 26px;
      padding: 18px 20px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.025);
    }
    .proof-source strong { display: flex; gap: 8px; color: #7ee2a1; }
    .proof-source p,
    .proof-state-card p:not(.proof-kicker) {
      margin: 10px 0 0;
      color: #8d887e;
      font-size: 0.87rem;
      line-height: 1.6;
    }
    .proof-button {
      display: inline-flex;
      min-height: 52px;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      border-radius: 13px;
      font-weight: 850;
      text-decoration: none;
    }
    .proof-button-primary { flex: 1; background: #ead878; color: #090907; }
    .proof-button-secondary { border: 1px solid rgba(255, 255, 255, 0.16); color: #f3efe5; }
    .proof-footer {
      margin-top: 34px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #8d887e;
      font-size: 0.8rem;
    }
    .proof-footer strong { color: #ead878; letter-spacing: 0.1em; }
    .proof-state-card { display: grid; gap: 20px; }
    .proof-state-card .proof-button { margin-top: 8px; }
    @media (max-width: 560px) {
      .proof-shell { align-items: start; padding-top: 26px; }
      .proof-card { border-radius: 20px; }
      .proof-hero { padding-top: 34px; }
      .proof-row { align-items: flex-start; }
      .proof-actions { flex-direction: column; }
      .proof-button { width: 100%; }
    }
  `}</style>
}
