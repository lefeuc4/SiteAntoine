'use client'

import { useState, useCallback } from 'react'
import { useDocumentInfo, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

/**
 * Safe delete button with type-to-confirm modal.
 *
 * Registered via `admin.components.edit.beforeDocumentControls` on collections.
 * Sends DELETE with X-Delete-Confirmation header matching server hook.
 */
export default function SafeDeleteButton() {
  const { id, collectionSlug, title } = useDocumentInfo()
  const { config } = useConfig()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const documentTitle = title || ''
  const apiRoute = config?.routes?.api || '/api'

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setInputValue('')
    setError(null)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setInputValue('')
    setError(null)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!id || !collectionSlug) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiRoute}/${collectionSlug}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Delete-Confirmation': inputValue,
        },
      })

      if (response.ok) {
        router.push(`/admin/collections/${collectionSlug}`)
      } else {
        const data = await response.json().catch(() => null)
        const message =
          data?.errors?.[0]?.message ||
          data?.message ||
          'Erreur lors de la suppression.'
        setError(message)
      }
    } catch {
      setError('Erreur reseau. Veuillez reessayer.')
    } finally {
      setLoading(false)
    }
  }, [id, collectionSlug, apiRoute, inputValue, router])

  // Don't render on create view (no id yet)
  if (!id) return null

  const isMatch = inputValue === documentTitle && inputValue.length > 0

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        style={{
          width: '100%',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--theme-error-500)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        Supprimer cet element
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--theme-bg)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--theme-error-500)',
              }}
            >
              Confirmer la suppression
            </h3>

            <p
              style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--theme-text)',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
              }}
            >
              Cette action est irreversible. Pour confirmer, tapez le titre exact
              de cet element :
            </p>

            <p
              style={{
                margin: '0 0 1rem 0',
                color: 'var(--theme-text)',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}
            >
              &laquo; {documentTitle} &raquo;
            </p>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError(null)
              }}
              onPaste={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              placeholder="Tapez le titre ici..."
              autoComplete="off"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: '4px',
                fontSize: '0.9375rem',
                color: 'var(--theme-text)',
                backgroundColor: 'var(--theme-elevation-50)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            {error && (
              <p
                style={{
                  margin: '0.5rem 0 0 0',
                  color: 'var(--theme-error-500)',
                  fontSize: '0.8125rem',
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1.5rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--theme-elevation-100)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!isMatch || loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isMatch
                    ? 'var(--theme-error-500)'
                    : 'var(--theme-elevation-100)',
                  color: isMatch ? 'white' : 'var(--theme-elevation-150)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isMatch && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Suppression...' : 'Supprimer definitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
