'use client'

import Hero from '../../sections/Hero'
import Editorial from '../../sections/Editorial'
import Collection from '../../sections/Collection'
import Gallery from '../../sections/Gallery'
import WhyUs from '../../sections/WhyUs'
import Craftsmanship from '../../sections/Craftsmanship'
import ExperienceGuide from '../../sections/ExperienceGuide'
import Testimonials from '../../sections/Testimonials'
import LocationMap from '../../sections/LocationMap'
import CTABanner from '../../sections/CTABanner'

const BOOKING_URL = 'https://letsbook.me/booking/bafanapyramidshotel'
const openBooking = () => window.open(BOOKING_URL, '_blank', 'noopener,noreferrer')

export default function HomeContent() {
  return (
    <>
      <Hero onBook={openBooking} />
      <Editorial />
      <Collection onBook={openBooking} />
      <Gallery />
      <WhyUs />
      <Craftsmanship />
      <ExperienceGuide />
      <Testimonials />
      <LocationMap />
      <CTABanner />
    </>
  )
}


