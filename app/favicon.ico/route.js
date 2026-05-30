const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#050505"/>
  <path d="M15 42V19h7v16h11v7H15Zm26 0V26H30v-7h18v23h-7Z" fill="#e2c95f"/>
</svg>`

export function GET() {
  return new Response(icon, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
