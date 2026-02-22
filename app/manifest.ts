import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'VERTIXA AI | Autonomous Invoice Intelligence',
        short_name: 'VERTIXA AI',
        description: 'B2B Invoice Authenticity & Fraud Detection System',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B0F14',
        theme_color: '#1F6BFF',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
