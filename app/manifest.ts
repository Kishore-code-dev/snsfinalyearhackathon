import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'XYLO AI | Autonomous Invoice Intelligence',
        short_name: 'XYLO AI',
        description: 'Next-generation AI agent system for autonomous invoice processing and fraud detection.',
        start_url: '/',
        display: 'standalone',
        background_color: '#020002',
        theme_color: '#8b5cf6', // Royal Purple theme color

        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
