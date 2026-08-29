'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null, 'loading', 'success', 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('success')
        setMessage('You\'re in! We\'ll send you fitness science updates.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Failed to subscribe. Try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        background: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
        <p style={{ color: '#155724', margin: 0, fontWeight: '500' }}>{message}</p>
      </div>
    )
  }

  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'center',
      color: 'white'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>
        Get Surpass in Your Inbox
      </h3>
      <p style={{ color: '#999', margin: '0 0 1.5rem 0' }}>
        Science-backed fitness tips. No spam. Unsubscribe anytime.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            width: '200px',
            maxWidth: '100%'
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: '#4CAF50',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1
          }}
        >
          {status === 'loading' ? 'Joining...' : 'Subscribe'}
        </button>
      </form>
      
      {status === 'error' && (
        <p style={{ color: '#ff6b6b', margin: '1rem 0 0 0', fontSize: '0.9rem' }}>{message}</p>
      )}
    </div>
  )
}
