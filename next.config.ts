import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['ubu-dev'],
  async redirects() {
    return [
      // WordPress main pages (index.php prefix pattern)
      { source: '/index.php/about-me', destination: '/mon-histoire', permanent: true },
      { source: '/index.php/about-me/:path*', destination: '/mon-histoire', permanent: true },
      { source: '/index.php/our-services', destination: '/services', permanent: true },
      { source: '/index.php/our-services/:path*', destination: '/services', permanent: true },
      { source: '/index.php/programs', destination: '/programmes', permanent: true },
      { source: '/index.php/programs/:path*', destination: '/programmes', permanent: true },
      // Individual service pages -> services
      { source: '/index.php/services/:path*', destination: '/services', permanent: true },
      { source: '/index.php/services_group/:path*', destination: '/services', permanent: true },
      // Blog/category -> home (no blog in v1)
      { source: '/index.php/category/:path*', destination: '/', permanent: true },
      { source: '/index.php/2016/:path*', destination: '/', permanent: true },
      // Results / transformations
      { source: '/index.php/classic-2-columns', destination: '/resultats', permanent: true },
      {
        source: '/index.php/classic-2-columns/:path*',
        destination: '/resultats',
        permanent: true,
      },
      // Contact
      { source: '/index.php/contact', destination: '/contact', permanent: true },
      { source: '/index.php/contact/:path*', destination: '/contact', permanent: true },
      // WordPress admin/API paths -> home (prevent 404 log noise)
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/xmlrpc.php', destination: '/', permanent: true },
    ]
  },
}

export default withPayload(nextConfig)
