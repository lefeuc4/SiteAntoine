'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useConfig } from '@payloadcms/ui'

export default function SingletonRedirect() {
  const router = useRouter()
  const { config } = useConfig()
  const adminRoute = config.routes?.admin || '/admin'

  useEffect(() => {
    // Fetch the single document and redirect to its edit page
    fetch(`/api/accueil?limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.docs?.[0]?.id) {
          router.replace(`${adminRoute}/collections/accueil/${data.docs[0].id}`)
        }
      })
  }, [router, adminRoute])

  return (
    <div style={{ padding: '2rem' }}>
      <p>Redirection...</p>
    </div>
  )
}
