'use client'

export default function Icon() {
  return (
    <div
      style={{
        minWidth: '2.75rem',
        height: '1.75rem',
        borderRadius: '0.375rem',
        backgroundColor: '#0F172A',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 0.375rem',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1,
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}
      >
        TDB
      </span>
    </div>
  )
}
