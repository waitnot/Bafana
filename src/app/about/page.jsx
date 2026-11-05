import ClientLayout from '../ClientLayout'
import About from '../../page-components/About'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'About Us — Bafana Pyramids Hotel & Spa',
  description: 'Learn about Bafana Pyramids Hotel & Spa in Giza, Cairo. Your gateway to Egypt\'s timeless wonders.',
}

export default function AboutPage() {
  return (
    <ClientLayout>
      <About />
    </ClientLayout>
  )
}





