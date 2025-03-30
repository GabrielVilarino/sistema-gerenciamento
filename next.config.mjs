/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['drive.google.com']
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                // destination: 'https://sistema-gerenciamento-back.onrender.com/:path*'
                destination: 'http://localhost:8000/:path*'
            }
        ]
    }
}

export default nextConfig;
