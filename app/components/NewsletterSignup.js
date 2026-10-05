export default function NewsletterSignup() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      border: '1px solid #333',
      borderRadius: '16px',
      padding: '2rem',
      margin: '3rem 0',
      textAlign: 'center',
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, #fff 0%, #a0a0a0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Questions about Surpass
      </h3>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Email support. This site does not collect a newsletter list.
      </p>
      <a
        href="mailto:support@jacked.coach"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '48px',
          padding: '0 1.25rem',
          background: 'linear-gradient(135deg, #e8ff47 0%, #c8e000 100%)',
          color: '#000',
          fontWeight: '700',
          borderRadius: '8px',
          textDecoration: 'none',
        }}
      >
        support@jacked.coach
      </a>
    </section>
  )
}
