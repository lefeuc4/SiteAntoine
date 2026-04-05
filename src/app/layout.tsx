import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://antoineprofit.com'),
  title: {
    default: 'Antoine Profit — Coach Bien-Etre',
    template: '%s — Antoine Profit',
  },
  description: 'Coaching bien-etre, nutrition et transformation physique avec Antoine Profit',
  icons: [{ type: 'image/svg+xml', url: '/favicon-site.svg' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.JSX.Element
}
