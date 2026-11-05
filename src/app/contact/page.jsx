import ClientLayout from '../ClientLayout'
import Contact from '../../page-components/Contact'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Contact Us — Bafana Pyramids Hotel & Spa',
  description: 'Contact Bafana Pyramids Hotel & Spa. Princess Street, Al Remaya, Giza. Phone: +20 1034 962 229.',
}

export default function ContactPage() {
  return (
    <ClientLayout>
      <Contact />
    </ClientLayout>
  )
}


