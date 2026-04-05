'use client'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div
        style={{
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '0.5rem',
          backgroundColor: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          A
        </span>
      </div>
      <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0F172A' }}>
        Administration
      </span>
    </div>
  )
}
