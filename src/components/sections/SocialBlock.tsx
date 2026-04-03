interface SocialBlockProps {
  instagramUrl?: string | null
  facebookUrl?: string | null
}

export default function SocialBlock({ instagramUrl, facebookUrl }: SocialBlockProps) {
  const hasInstagram = instagramUrl && instagramUrl.trim() !== ''
  const hasFacebook = facebookUrl && facebookUrl.trim() !== ''

  if (!hasInstagram && !hasFacebook) {
    return null
  }

  return (
    <div className="flex items-center gap-4 py-2">
      <span className="text-sm text-gris-ardoise">Retrouvez-moi aussi sur :</span>

      {hasInstagram && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram d'Antoine Profit"
          className="text-gris-ardoise hover:text-bleu-electrique transition-colors"
          style={{ transitionDuration: 'var(--transition-fast)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        </a>
      )}

      {hasFacebook && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook d'Antoine Profit"
          className="text-gris-ardoise hover:text-bleu-electrique transition-colors"
          style={{ transitionDuration: 'var(--transition-fast)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
          </svg>
        </a>
      )}
    </div>
  )
}
