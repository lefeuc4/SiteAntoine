import { getPayload } from 'payload'
import config from '@payload-config'

export default async function DashboardWidget() {
  const payload = await getPayload({ config })

  const { totalDocs: programmesCount } = await payload.count({
    collection: 'programmes',
    overrideAccess: true,
  })
  const { totalDocs: resultatsCount } = await payload.count({
    collection: 'resultats',
    overrideAccess: true,
  })

  return (
    <div
      style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        background: 'var(--theme-elevation-50)',
        borderRadius: '4px',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          lineHeight: 1.3,
          marginTop: 0,
          marginBottom: '1.5rem',
          color: 'var(--theme-text)',
        }}
      >
        Bienvenue, Antoine
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        }}
      >
        {/* Programmes counter card */}
        <div
          style={{
            background: 'var(--theme-elevation-100)',
            borderRadius: '4px',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--theme-text)',
            }}
          >
            {programmesCount}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              lineHeight: 1.4,
              marginTop: '0.5rem',
              color: 'var(--theme-text)',
            }}
          >
            Programmes
          </div>
          <a
            href="/admin/collections/programmes/create"
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--theme-success, #10B981)',
              textDecoration: 'none',
              minHeight: '44px',
              lineHeight: '44px',
            }}
          >
            + Ajouter un programme
          </a>
        </div>

        {/* Resultats counter card */}
        <div
          style={{
            background: 'var(--theme-elevation-100)',
            borderRadius: '4px',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--theme-text)',
            }}
          >
            {resultatsCount}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              lineHeight: 1.4,
              marginTop: '0.5rem',
              color: 'var(--theme-text)',
            }}
          >
            Resultats avant/apres
          </div>
          <a
            href="/admin/collections/resultats/create"
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--theme-success, #10B981)',
              textDecoration: 'none',
              minHeight: '44px',
              lineHeight: '44px',
            }}
          >
            + Ajouter un resultat
          </a>
        </div>

        {/* Pages counter card */}
        <div
          style={{
            background: 'var(--theme-elevation-100)',
            borderRadius: '4px',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--theme-text)',
            }}
          >
            5
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              lineHeight: 1.4,
              marginTop: '0.5rem',
              color: 'var(--theme-text)',
            }}
          >
            Pages a editer
          </div>
          <a
            href="/admin/collections/page-content"
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--theme-success, #10B981)',
              textDecoration: 'none',
              minHeight: '44px',
              lineHeight: '44px',
            }}
          >
            Modifier les pages
          </a>
        </div>
      </div>
    </div>
  )
}
