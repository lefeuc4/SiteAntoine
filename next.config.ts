import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['ubu-dev'],
}

export default withPayload(nextConfig)
