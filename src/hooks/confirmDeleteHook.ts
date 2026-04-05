import type { CollectionBeforeDeleteHook } from 'payload'
import { APIError } from 'payload'

/**
 * Factory that returns a BeforeDeleteHook requiring explicit confirmation.
 *
 * The hook reads a custom `x-delete-confirmation` header from the request.
 * If the header value does not match the document's title field, the delete
 * is rejected with a 400 error.
 *
 * Local API calls (seed scripts, server-side programmatic calls) bypass
 * the confirmation check automatically.
 *
 * @param titleField - The field name used as title for the collection
 */
export function createConfirmDeleteHook(titleField: string): CollectionBeforeDeleteHook {
  return async ({ collection, id, req }) => {
    // Local API calls (seed, server actions, programmatic) bypass confirmation
    if (req.payloadAPI === 'local') {
      return
    }

    // Fetch the document to get the title value
    const doc = await req.payload.findByID({
      collection: collection.slug as never,
      id,
      overrideAccess: true,
      depth: 0,
    })

    const documentTitle = String(doc[titleField] ?? '')

    // Read confirmation header (Payload 3 uses Web Headers API)
    const confirmation = req.headers.get('x-delete-confirmation')

    if (!confirmation) {
      throw new APIError(
        'Suppression refusee : confirmation requise. Utilisez le bouton "Supprimer" dans l\'editeur.',
        400,
      )
    }

    if (confirmation !== documentTitle) {
      throw new APIError(
        'Suppression refusee : la confirmation ne correspond pas au titre du document.',
        400,
      )
    }
  }
}
