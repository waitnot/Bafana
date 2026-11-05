import ClientLayout from '../ClientLayout'
import Amenities from '../../page-components/Amenities'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Hotel Amenities — Bafana Pyramids Hotel & Spa',
  description: 'Discover the facilities and amenities at Bafana Pyramids Hotel & Spa. Rooftop restaurant, pool, spa and more.',
}

export default function AmenitiesPage() {
  return (
    <ClientLayout>
      <Amenities />
    </ClientLayout>
  )
}





