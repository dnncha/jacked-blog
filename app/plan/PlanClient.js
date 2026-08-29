'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { decodePlanPayload } from './planContract.mjs'

const APP_STORE_URL = 'https://apps.apple.com/app/apple-store/id6757132605?pt=128406689&ct=plan_share_web&mt=8'

function countLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

function ActionLinks() {
  return (
    <div className="shared-plan-actions">
      <a className="shared-plan-button shared-plan-button-primary" href={APP_STORE_URL}>
        Build your own plan in Surpass
      </a>
      <Link className="shared-plan-button shared-plan-button-secondary" href="/">
        See how Surpass works
      </Link>
    </div>
  )
}

function InvalidPlan() {
  return (
    <section className="shared-plan-shell" role="alert">
      <p className="shared-plan-eyebrow">PLAN LINK UNAVAILABLE</p>
      <h1>This plan link is invalid or incomplete.</h1>
      <p className="shared-plan-lede">
        Ask the person who shared it to send the link again, or start a new plan in Surpass.
      </p>
      <ActionLinks />
    </section>
  )
}

function SharedPlan({ plan }) {
  return (
    <section className="shared-plan-shell" aria-live="polite">
      <p className="shared-plan-eyebrow">READ-ONLY PLAN SHARE</p>
      <h1>{plan.t}</h1>
      <p className="shared-plan-lede">A clear plan for the work ahead, shared from Surpass.</p>

      <div className="shared-plan-days">
        {plan.d.map((day, index) => (
          <article className="shared-plan-day" key={`${day.n}-${index}`}>
            <div className="shared-plan-day-heading">
              <span className="shared-plan-day-number">DAY {String(index + 1).padStart(2, '0')}</span>
              <h2>{day.n}</h2>
            </div>
            <p className="shared-plan-meta">
              {countLabel(day.c, 'exercise')} · {countLabel(day.s, 'working set', 'working sets')}
            </p>
            {(day.r || day.q) && (
              <p className="shared-plan-targets">
                {[day.r, day.q].filter(Boolean).join(' · ')}
              </p>
            )}
            <ul className="shared-plan-exercises">
              {day.x.map((line, lineIndex) => <li key={`${line}-${lineIndex}`}>{line}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <ActionLinks />
      <p className="shared-plan-notice">
        This preview includes plan prescriptions only. It does not include private notes, logged history,
        account details, or independent training verification.
      </p>
    </section>
  )
}

export default function PlanClient() {
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  const [state, setState] = useState({ status: 'loading', plan: null })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const plan = await decodePlanPayload({
          query: new URLSearchParams(query),
          href: window.location.href,
        })
        if (!cancelled) {
          window.mixpanel?.track?.('plan_share_web_opened', {
            campaign: 'plan_share',
            source: 'web_link',
          })
          setState({ status: 'ready', plan })
        }
      } catch {
        if (!cancelled) setState({ status: 'invalid', plan: null })
      }
    }

    load()
    return () => { cancelled = true }
  }, [query])

  return (
    <>
      <style>{`
        .shared-plan-shell {
          width: min(760px, calc(100% - 32px));
          margin: 0 auto;
          padding: clamp(56px, 9vw, 92px) 0 84px;
          color: #f5f1e8;
        }
        .shared-plan-eyebrow {
          margin: 0 0 16px;
          color: #e2c95f;
          font-size: 0.75rem;
          font-weight: 850;
          letter-spacing: 0.17em;
        }
        .shared-plan-shell h1 {
          max-width: 700px;
          margin: 0;
          font-size: clamp(2.75rem, 8vw, 5.6rem);
          line-height: 0.94;
          letter-spacing: -0.06em;
        }
        .shared-plan-lede {
          max-width: 620px;
          margin: 24px 0 34px;
          color: #bcb6a8;
          font-size: 1.12rem;
          line-height: 1.65;
        }
        .shared-plan-days {
          display: grid;
          gap: 16px;
        }
        .shared-plan-day {
          padding: 24px;
          border: 1px solid rgba(226, 201, 95, 0.22);
          border-radius: 22px;
          background: linear-gradient(145deg, #171713, #0b0b0a);
        }
        .shared-plan-day-heading {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px;
        }
        .shared-plan-day-number {
          color: #e2c95f;
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.16em;
        }
        .shared-plan-day h2 {
          margin: 0;
          color: #f5f1e8;
          font-size: 1.5rem;
          letter-spacing: -0.03em;
        }
        .shared-plan-meta {
          margin: 0 0 16px;
          color: #bcb6a8;
          font-size: 0.88rem;
        }
        .shared-plan-targets {
          margin: -5px 0 16px;
          color: #f5f1e8;
          font-size: 0.88rem;
          font-weight: 750;
        }
        .shared-plan-exercises {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .shared-plan-exercises li {
          padding-top: 10px;
          border-top: 1px solid rgba(245, 241, 232, 0.1);
          color: #e9e5dc;
          line-height: 1.5;
        }
        .shared-plan-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .shared-plan-button {
          display: inline-flex;
          box-sizing: border-box;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 11px;
          font-weight: 850;
          text-decoration: none;
        }
        .shared-plan-button-primary {
          color: #17150f;
          background: #e2c95f;
        }
        .shared-plan-button-secondary {
          border: 1px solid rgba(245, 241, 232, 0.2);
          color: #f5f1e8;
        }
        .shared-plan-notice {
          margin: 22px 0 0;
          padding: 18px;
          border: 1px solid rgba(245, 241, 232, 0.1);
          border-radius: 16px;
          color: #9d978b;
          font-size: 0.82rem;
          line-height: 1.55;
        }
        @media (max-width: 560px) {
          .shared-plan-shell { width: min(100% - 28px, 760px); }
          .shared-plan-day { padding: 20px; border-radius: 18px; }
          .shared-plan-actions { display: grid; }
          .shared-plan-button { width: 100%; }
        }
      `}</style>
      {state.status === 'ready' && state.plan
        ? <SharedPlan plan={state.plan} />
        : state.status === 'invalid'
          ? <InvalidPlan />
          : <section className="shared-plan-shell" aria-live="polite">
            <p className="shared-plan-eyebrow">READ-ONLY PLAN SHARE</p>
            <h1>Loading shared plan…</h1>
            <p className="shared-plan-lede">A clear plan for the work ahead, shared from Surpass.</p>
          </section>}
    </>
  )
}
