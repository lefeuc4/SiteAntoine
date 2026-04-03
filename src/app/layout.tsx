import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Antoine Profit - Coach Bien-Etre',
  description: 'Coaching bien-etre, nutrition et transformation physique avec Antoine Profit',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
