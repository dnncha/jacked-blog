const APP_ID = '952M2MVR9R.com.jacked.app'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appIDs: [APP_ID],
            components: [
              {
                '/': '/plan/*',
                comment: 'Open shared Surpass plans in the native app.',
              },
            ],
          },
        ],
      },
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    },
  )
}
