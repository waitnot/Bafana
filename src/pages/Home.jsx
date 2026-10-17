import Hero from '../sections/Hero'
import Editorial from '../sections/Editorial'
import Collection from '../sections/Collection'
import Gallery from '../sections/Gallery'
import WhyUs from '../sections/WhyUs'
import Craftsmanship from '../sections/Craftsmanship'
import Testimonials from '../sections/Testimonials'
import LocationMap from '../sections/LocationMap'
import ExperienceGuide from '../sections/ExperienceGuide'
import CTABanner from '../sections/CTABanner'

export default function Home({ onBook }) {
  return (
    <>
      <Hero onBook={onBook} />
      <Editorial />
      <Collection onBook={onBook} />
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
