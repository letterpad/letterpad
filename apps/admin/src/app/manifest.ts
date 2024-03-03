import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "short_name": "Letterpad",
        "name": "Letterpad",
        "icons": [
            {
                "src": "/static/favicons/apple-touch-icon-60x60.png",
                "type": "image/png",
                "sizes": "60x60"
            },
            {
                "src": "/static/favicons/apple-touch-icon-120x120.png",
                "type": "image/png",
                "sizes": "120x120"
            },
            {
                "src": "/static/favicons/apple-touch-icon-152x152.png",
                "type": "image/png",
                "sizes": "152x152"
            }
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

