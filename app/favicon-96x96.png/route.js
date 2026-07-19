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
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: -2,
        }}
      >
        J
      </div>
    ),
    { width: 96, height: 96 },
  )

  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  return response
}
