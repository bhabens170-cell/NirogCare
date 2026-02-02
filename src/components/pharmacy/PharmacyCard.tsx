import { motion } from 'framer-motion';
import { Star, MapPin, Navigation, Phone, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  isOpen: boolean | null;
  lat: number;
  lng: number;
  distance: string;
  photo: string | null;
}

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  index: number;
  userLocation: { latitude: number; longitude: number } | null;
  onSelect?: () => void;
  selected?: boolean;
}

export default function PharmacyCard({ pharmacy, index, userLocation, onSelect, selected }: PharmacyCardProps) {
  // Use Google Maps for directions
  const openDirections = () => {
    const destination = `${pharmacy.lat},${pharmacy.lng}`;
    const origin = userLocation 
      ? `${userLocation.latitude},${userLocation.longitude}`
      : '';
    // Use Google Maps routing
    const url = origin 
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const openInMaps = () => {
    // Open location on Google Maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${pharmacy.lat},${pharmacy.lng}&query_place_id=${pharmacy.id}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      className={`group relative bg-card rounded-3xl border shadow-lg overflow-hidden ${selected ? 'border-primary/60 ring-2 ring-primary/20' : 'border-border/50'} ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Top badge for rank */}
      {index < 3 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className="absolute top-4 left-4 z-10"
        >
          <div className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg
            ${index === 0 ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : ''}
            ${index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800' : ''}
            ${index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' : ''}
          `}>
            <Sparkles className="w-3.5 h-3.5" />
            #{index + 1} Nearest
          </div>
        </motion.div>
      )}

      {/* Photo section */}
      <div className="relative h-44 overflow-hidden">
        {pharmacy.photo ? (
          <motion.img
            src={pharmacy.photo}
            alt={pharmacy.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MapPin className="w-16 h-16 text-primary/40" />
            </motion.div>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md
              ${pharmacy.isOpen === true ? 'bg-emerald-500/90 text-white' : ''}
              ${pharmacy.isOpen === false ? 'bg-red-500/90 text-white' : ''}
              ${pharmacy.isOpen === null ? 'bg-slate-500/90 text-white' : ''}
            `}
          >
            <Clock className="w-3.5 h-3.5" />
            {pharmacy.isOpen === true ? 'Open Now' : pharmacy.isOpen === false ? 'Closed' : 'Hours N/A'}
          </motion.div>
        </div>

        {/* Distance pill */}
        <div className="absolute bottom-4 left-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-foreground font-semibold text-sm shadow-lg"
          >
            <Navigation className="w-3.5 h-3.5 text-primary" />
            {pharmacy.distance}
          </motion.div>
        </div>
      </div>

      {/* Content section */}
      <div className="relative p-5 space-y-4">
        {/* Name and rating */}
        <div>
          <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {pharmacy.name}
          </h3>
          
          {pharmacy.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                <span className="font-bold text-amber-700">{pharmacy.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({pharmacy.totalRatings.toLocaleString()} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Address */}
        <p className="flex items-start gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary/60" />
          <span className="line-clamp-2">{pharmacy.address}</span>
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={openDirections}
            className="rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </Button>
          <Button
            variant="outline"
            onClick={openInMaps}
            className="rounded-xl border-2 hover:bg-secondary/50 font-semibold transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View More
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
