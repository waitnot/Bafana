import '../styles/globals.css'

export const metadata = {
  metadataBase: new URL('https://bafanapyramidshotel.com'),
  title: 'Bafana Pyramids Hotel & Spa — Giza, Cairo, Egypt',
  description: 'Your Gateway to Egypt\'s Timeless Wonders. Luxury hotel in Giza near the Great Pyramids. Book your stay at Bafana Pyramids Hotel & Spa.',
  keywords: 'Bafana Pyramids, Hotel Giza, Cairo Hotel, Egypt Hotel, Pyramids Hotel, Luxury Hotel Egypt',
  openGraph: {
    title: 'Bafana Pyramids Hotel & Spa',
    description: 'Your Gateway to Egypt\'s Timeless Wonders. Located in Giza, Cairo.',
    type: 'website',
    url: 'https://bafanapyramidshotel.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}




