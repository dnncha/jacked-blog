import { ImageResponse } from 'next/og'
import { toolMap, tools } from '../../toolData.mjs'
import { toolSocialTitleSize, toolTypeLabel } from '../../toolSocial.mjs'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function GET(_request, { params }) {
  const { slug } = await params
  const tool = toolMap[slug]
  if (!tool) return new Response('Not found', { status: 404 })

  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#050505',
          color: '#f7f2e8',
          padding: 64,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: 520,
            right: -180,
            top: -230,
            background: 'rgba(226, 201, 95, 0.13)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 720,
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ color: '#e2c95f', fontSize: 34, fontWeight: 900, letterSpacing: 2 }}>JACKED</div>
            <div style={{ width: 48, height: 2, background: '#554b24' }} />
            <div style={{ color: '#a9a294', fontSize: 24, fontWeight: 750, letterSpacing: 1.5 }}>
              {toolTypeLabel(tool.type)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                fontSize: toolSocialTitleSize(tool.name),
                lineHeight: 0.98,
                fontWeight: 900,
                letterSpacing: -2.5,
                maxWidth: 720,
                overflowWrap: 'break-word',
              }}
            >
              {tool.name}
            </div>
            <div style={{ color: '#b7b0a3', fontSize: 27, lineHeight: 1.3, maxWidth: 680 }}>
              {tool.promise}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 22, fontWeight: 800 }}>
            <div style={{ color: '#111', background: '#e2c95f', borderRadius: 10, padding: '12px 18px' }}>
              Free web tool
            </div>
            <div style={{ color: '#d7d1c5', border: '1px solid #37342e', borderRadius: 10, padding: '11px 18px' }}>
              No account required
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            marginLeft: 36,
            width: 260,
            flexShrink: 0,
            border: '1px solid #3d3827',
            borderRadius: 22,
            background: '#0b0b0a',
            padding: 28,
            gap: 18,
            boxShadow: '0 28px 80px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ color: '#e2c95f', fontSize: 18, fontWeight: 850, letterSpacing: 1.5 }}>QUICK RESULT</div>
          {['Enter the set', 'See the target', 'Share the tool'].map((label, index) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: 38,
                  color: index === 2 ? '#111' : '#e2c95f',
                  background: index === 2 ? '#e2c95f' : '#1a1812',
                  fontSize: 19,
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </div>
              <div style={{ color: '#e9e4da', fontSize: 21, fontWeight: 720 }}>{label}</div>
            </div>
          ))}
          <div style={{ height: 1, background: '#2d2a23', marginTop: 4 }} />
          <div style={{ color: '#8f897c', fontSize: 18 }}>jacked.coach/tools</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )

  response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  return response
}
