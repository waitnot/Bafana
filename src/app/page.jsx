import ClientLayout from './ClientLayout'
import HomePage from './home/HomeContent'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bafana Pyramids Hotel & Spa — Your Gateway to Egypt\'s Timeless Wonders',
  description: 'Luxury hotel in Giza, Cairo near the Great Pyramids of Egypt. Book rooms, suites and spa experiences at Bafana Pyramids Hotel & Spa.',
}

export default function Page() {
  return (
    <ClientLayout>
      <HomePage />
    </ClientLayout>
  )
}




