import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "short_name": "Letterpad",
        "name": "Letterpad",
        "icons": [
            {
                "src": "/logo/logo.png",
                "type": "image/png",
                "sizes": "140x140"
            },
        ],
        "id": "/?ref=pwa",
        "start_url": "/?ref=pwa",
        "background_color": "#3168de",
        "display": "standalone",
        "scope": "/",
        "theme_color": "#000",
        "description": "Publish stories, build subscribers, follow other publishers and start earning."
    }
}

