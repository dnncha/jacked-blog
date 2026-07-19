import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

export function GET() {
  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050505',
          color: '#f7f2e8',
          padding: 72,
        }}
      >
        <div style={{ color: '#e2c95f', fontSize: 40, fontWeight: 850, letterSpacing: 2 }}>
          JACKED
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 84, lineHeight: 0.96, fontWeight: 850, letterSpacing: -3 }}>
            Know your next set.
          </div>
          <div style={{ maxWidth: 880, color: '#b7b0a3', fontSize: 32, lineHeight: 1.32 }}>
            Fast workout logging, RIR-aware progression, rest timing, tools, and Hevy import for iPhone.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, color: '#111', fontSize: 28, fontWeight: 800 }}>
          <div style={{ background: '#e2c95f', borderRadius: 10, padding: '16px 24px' }}>Next-set targets</div>
          <div style={{ background: '#f7f2e8', borderRadius: 10, padding: '16px 24px' }}>Training tools</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )

  response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  return response
}
