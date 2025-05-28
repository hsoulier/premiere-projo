/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: { fetches: { fullUrl: true } },
  compiler: { removeConsole: false },
}

export default nextConfig
