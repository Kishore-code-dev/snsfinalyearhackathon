import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'XYLO | Biological Supply Chain Web App',
        short_name: 'XYLO',
        description: 'Living Intelligence for modern supply chains.',
        start_url: '/',
        display: 'standalone',
        background_color: '#020005',
        theme_color: '#22d3ee',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
