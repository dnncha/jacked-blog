'use client'

import { useState } from 'react'

export default function CopyPlanLink({ url, programId }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      window.prompt('Copy this plan link', url)
    }
  }

  return (
    <button
      type="button"
      className="lib-button lib-button-secondary"
      style={{ background: 'transparent', cursor: 'pointer', font: 'inherit', fontWeight: 820, fontSize: '0.92rem' }}
      onClick={copy}
      data-program-share={programId}
    >
      {copied ? 'Link copied' : 'Copy plan link'}
    </button>
  )
}
