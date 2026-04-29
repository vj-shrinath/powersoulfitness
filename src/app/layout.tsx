export const runtime = "edge";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: '#a862ed',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Power Soul Fitness - Best Gym in Lonar, Maharashtra",
    template: "%s | Power Soul Fitness Lonar"
  },
  description: "Transform your body at Power Soul Fitness, the premier gym in Lonar. Expert personal training, modern equipment, and a dedicated fitness community.",
  keywords: ["Gym in Lonar", "Best gym in Lonar", "Fitness center Lonar", "Personal trainer Lonar", "Weight loss Lonar", "Power Soul Fitness"],
  authors: [{ name: "Shiv Mapari" }],
  creator: "Power Soul Fitness",
  publisher: "Power Soul Fitness",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  metadataBase: new URL('https://powersoulfitness.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PSF Lonar',
  },
  openGraph: {
    title: 'Power Soul Fitness - Best Gym in Lonar',
    description: 'The most premium fitness destination in Lonar. World-class equipment and expert coaching.',
    url: 'https://powersoulfitness.com',
    siteName: 'Power Soul Fitness',
    locale: 'en_IN',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "Power Soul Fitness",
  "image": "https://powersoulfitness.com/images/logo.png",
  "@id": "https://powersoulfitness.com",
  "url": "https://powersoulfitness.com",
  "telephone": "+919527958899",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Opposite Limbi Lake, Loni Road",
    "addressLocality": "Lonar",
    "addressRegion": "Maharashtra",
    "postalCode": "443302",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.9868, // Approximate for Lonar
    "longitude": 76.5186
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "06:00",
      "closes": "21:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/powersoulfitness",
    "https://www.instagram.com/powersoulfitness"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
          precedence="default"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
