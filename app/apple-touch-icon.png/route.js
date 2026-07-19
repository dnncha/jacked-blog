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
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          color: '#e2c95f',
          fontSize: 82,
          fontWeight: 900,
          letterSpacing: -4,
        }}
      >
        JK
      </div>
    ),
    { width: 180, height: 180 },
  )

  response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  return response
}
