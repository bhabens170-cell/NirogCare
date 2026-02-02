import { useState } from 'react';
import LocationPermission from './LocationPermission';

export default function PharmacyLocator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  const handleLocationRequest = () => {
    // Check if location was actually granted
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const location = JSON.parse(storedLocation);
      const isRecent = Date.now() - location.timestamp < 300000; // 5 minutes
      
      if (isRecent) {
        setLocationGranted(true);
        setError(null);
        console.log('Location granted:', location);
        // Here you would typically fetch nearby pharmacies
        return;
      }
    }
    
    // If no recent location, show error
    setError('Location access is required to find nearby pharmacies');
  };

  if (locationGranted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-green-600">Location Enabled!</h2>
          <p className="text-muted-foreground">
            Finding nearby pharmacies...
          </p>
          {/* Here you would render the pharmacy list or map */}
        </div>
      </div>
    );
  }

  return (
    <LocationPermission
      onRequestLocation={handleLocationRequest}
      isLoading={isLoading}
      error={error}
    />
  );
}
