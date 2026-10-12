/**
 * Vercel serverless function — fetches real Google reviews via Places API
 * Uses GOOGLE_MAPS_API_KEY env variable
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const apiKey  = process.env.GOOGLE_MAPS_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4' // fallback

    // Fetch place details including reviews
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&reviews_sort=newest&key=${apiKey}&language=en`

    const r = await fetch(url)
    const data = await r.json()

    if (data.status !== 'OK') {
      console.error('Places API error:', data)
      return res.status(500).json({ error: data.status, detail: data.error_message })
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

    return res.json({
      reviews,
      summary: {
        averageRating: place.rating,
        totalReviews:  place.user_ratings_total,
      }
    })

  } catch (err) {
    console.error('Google Reviews error:', err)
    return res.status(500).json({ error: err.message })
  }
}
