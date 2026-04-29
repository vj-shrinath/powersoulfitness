import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Power Soul Fitness Lonar',
    short_name: 'PSF Lonar',
    description: 'The premier fitness destination in Lonar. Transform your body and soul with expert training.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#a862ed',
    icons: [
      {
        src: '/images/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
