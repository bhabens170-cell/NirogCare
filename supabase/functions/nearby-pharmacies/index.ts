import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, radius = 5000 } = await req.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Places API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for pharmacies near ${latitude}, ${longitude} with radius ${radius}m`);

    // Use Google Places API (New) - Nearby Search
    const placesUrl = 'https://places.googleapis.com/v1/places:searchNearby';
    
    const requestBody = {
      includedTypes: ['pharmacy', 'drugstore'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude
          },
          radius: radius
        }
      }
    };

    const response = await fetch(placesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.photos,places.types'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Google Places API error', details: errorData.error?.message || 'Unknown error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Found ${data.places?.length || 0} pharmacies`);

    // Haversine formula for distance calculation
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const pharmacies = (data.places || []).map((place: any) => {
      const placeLat = place.location?.latitude;
      const placeLng = place.location?.longitude;
      
      if (!placeLat || !placeLng) return null;

      const distance = calculateDistance(latitude, longitude, placeLat, placeLng);

      // Get photo URL if available
      let photoUrl = null;
      if (place.photos && place.photos.length > 0) {
        const photoName = place.photos[0].name;
        photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${apiKey}`;
      }

      return {
        id: place.id,
        name: place.displayName?.text || 'Pharmacy',
        address: place.formattedAddress || 'Address not available',
        rating: place.rating || null,
        totalRatings: place.userRatingCount || 0,
        isOpen: place.currentOpeningHours?.openNow ?? null,
        lat: placeLat,
        lng: placeLng,
        distance: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
        distanceValue: distance,
        photo: photoUrl,
        phone: place.nationalPhoneNumber || null,
        website: place.websiteUri || null,
        types: place.types || ['pharmacy'],
      };
    }).filter(Boolean);

    // Sort by distance
    pharmacies.sort((a: any, b: any) => a.distanceValue - b.distanceValue);

    console.log(`Returning ${pharmacies.length} pharmacies`);

    return new Response(
      JSON.stringify({ 
        pharmacies,
        userLocation: { latitude, longitude },
        totalFound: pharmacies.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in nearby-pharmacies function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
