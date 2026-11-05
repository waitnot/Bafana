import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey  = process.env.GOOGLE_MAPS_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&reviews_sort=newest&key=${apiKey}&language=en`
    const r = await fetch(url)
    const data = await r.json()

    if (data.status !== 'OK') {
      return NextResponse.json({ error: data.status }, { status: 500 })
    }

    const place = data.result
    const reviews = (place.reviews || []).map(r => ({
      id:           r.time,
      name:         r.author_name,
      profilePhoto: r.profile_photo_url || null,
      rating:       r.rating,
      text:         r.text,
      date:         new Date(r.time * 1000).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    }))

    return NextResponse.json({
      reviews,
      summary: {
        averageRating: place.rating,
        totalReviews:  place.user_ratings_total,
      }
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
