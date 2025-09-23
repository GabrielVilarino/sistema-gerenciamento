/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**', // qualquer caminho
      },
    ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://sistema-gerenciamento-back.onrender.com/:path*'
                // destination: 'http://localhost:8000/:path*'
            }
        ]
    }
}

export default nextConfig;
