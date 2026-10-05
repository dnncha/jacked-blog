import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-static'

export async function GET() {
  const file = await readFile(path.join(process.cwd(), 'public/favicon.ico'))
  return new Response(file, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
