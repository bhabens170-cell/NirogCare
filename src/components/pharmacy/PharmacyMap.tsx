/**
 * PharmacyMap - Static OpenStreetMap embed (No API key needed)
 * Simple, reliable, works with all React versions
 */

import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserLocation = { latitude: number; longitude: number };

type Pharmacy = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isOpen: boolean | null;
  distance: string;
  phone?: string;
};

interface PharmacyMapProps {
  userLocation: UserLocation;
  pharmacies: Pharmacy[];
  selectedPharmacyId?: string | null;
  onSelectPharmacy?: (pharmacyId: string) => void;
  apiKey?: string;
}

export default function PharmacyMap({
  userLocation,
  pharmacies,
  selectedPharmacyId,
  onSelectPharmacy,
}: PharmacyMapProps) {
  const { latitude, longitude } = userLocation;

  // Get the selected pharmacy or first available
  const selectedPharmacy = selectedPharmacyId
    ? pharmacies.find(p => p.id === selectedPharmacyId)
    : pharmacies[0];

  // Create OpenStreetMap embed URL
  // Using OpenStreetMap's standard embed with markers
  const mapUrl = selectedPharmacy
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02},${latitude - 0.02},${longitude + 0.02},${latitude + 0.02}&layer=mapnik&marker=${selectedPharmacy.lat},${selectedPharmacy.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02},${latitude - 0.02},${longitude + 0.02},${latitude + 0.02}&layer=mapnik&marker=${latitude},${longitude}`;

  const openFullMap = () => {
    const url = selectedPharmacy
      ? `https://www.openstreetmap.org/?mlat=${selectedPharmacy.lat}&mlon=${selectedPharmacy.lng}#map=15/${selectedPharmacy.lat}/${selectedPharmacy.lng}`
      : `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
    window.open(url, '_blank');
  };

  const openDirections = (pharmacy: Pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${pharmacy.lat},${pharmacy.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Map iframe */}
      <div className="relative flex-1 min-h-[250px] bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden">
        <iframe
          src={mapUrl}
          style={{ border: 0, width: '100%', height: '100%' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Pharmacy Location Map"
        />

        {/* Open in new tab button */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 shadow-lg"
          onClick={openFullMap}
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Full Map
        </Button>
      </div>

      {/* Quick pharmacy list */}
      <div className="bg-card border-t p-3 rounded-b-xl max-h-[200px] overflow-y-auto">
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          📍 {pharmacies.length} pharmacies nearby
        </p>
        <div className="space-y-2">
          {pharmacies.slice(0, 5).map((pharmacy) => (
            <div
              key={pharmacy.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedPharmacyId === pharmacy.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted'
                }`}
              onClick={() => onSelectPharmacy?.(pharmacy.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MapPin className={`w-4 h-4 flex-shrink-0 ${pharmacy.isOpen ? 'text-emerald-500' : 'text-gray-400'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{pharmacy.name}</p>
                  <p className="text-xs text-muted-foreground">{pharmacy.distance}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {pharmacy.phone && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${pharmacy.phone}`; }}
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); openDirections(pharmacy); }}
                >
                  <Navigation className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
