/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['drive.google.com']
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8000/:path*'
            }
        ]
    }
}

export default nextConfig;
