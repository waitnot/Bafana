/**
 * Vercel serverless function — fetches real Google Business Profile reviews
 * Uses OAuth 2.0 with offline refresh token to get a fresh access token
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // Step 1: Exchange refresh token for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type:    'refresh_token',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      console.error('Token error:', tokenData)
      return res.status(500).json({ error: 'Failed to get access token', detail: tokenData })
    }

    const accessToken = tokenData.access_token
    const accountId  = process.env.GOOGLE_ACCOUNT_ID   // e.g. accounts/123456789
    const locationId = process.env.GOOGLE_LOCATION_ID  // e.g. locations/8639322241901481078

    // Step 2: Fetch reviews from Google Business Profile API
    const reviewsRes = await fetch(
      `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/reviews?pageSize=50&orderBy=updateTime%20desc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const reviewsData = await reviewsRes.json()

    if (!reviewsRes.ok) {
      console.error('Reviews API error:', reviewsData)
      return res.status(reviewsRes.status).json({ error: 'Failed to fetch reviews', detail: reviewsData })
    }

    // Step 3: Transform to a clean format
    const reviews = (reviewsData.reviews || []).map(r => ({
      id:          r.reviewId,
      name:        r.reviewer?.displayName || 'Anonymous',
      profilePhoto:r.reviewer?.profilePhotoUrl || null,
      rating:      starRating(r.starRating),
      text:        r.comment || '',
      date:        r.updateTime,
      reply:       r.reviewReply?.comment || null,
    }))

    const summary = {
      totalReviews:   reviewsData.totalReviewCount || reviews.length,
      averageRating:  reviewsData.averageRating || calcAvg(reviews),
    }

    return res.json({ reviews, summary })

  } catch (err) {
    console.error('Google Reviews error:', err)
    return res.status(500).json({ error: err.message })
  }
}

function starRating(str) {
  const map = {
    ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
    STAR_RATING_UNSPECIFIED: 0,
  }
  return map[str] ?? 0
}

function calcAvg(reviews) {
  if (!reviews.length) return 0
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
}
