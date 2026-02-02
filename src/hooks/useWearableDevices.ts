import { useState, useEffect, useCallback } from 'react';
import { WearableDevice, DeviceData, SleepData } from '@/types/health';

interface WearableConnection {
  device: WearableDevice;
  isConnected: boolean;
  lastSync?: string;
  error?: string;
}

// Mock wearable device APIs
const WEARABLE_APIS = {
  appleHealth: {
    name: 'Apple Health',
    type: 'apple_health',
    checkAvailability: () => typeof window !== 'undefined' && 'webkit' in window,
    connect: async () => {
      // Mock Apple Health connection
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });
    },
    fetchData: async (): Promise<DeviceData> => {
      // Mock Apple Health data
      return {
        deviceId: 'apple_health_mock',
        timestamp: new Date().toISOString(),
        metrics: {
          steps: Math.floor(Math.random() * 5000) + 5000,
          heartRate: Math.floor(Math.random() * 40) + 60,
          calories: Math.floor(Math.random() * 500) + 1800,
          distance: Math.floor(Math.random() * 3000) + 2000,
          activeMinutes: Math.floor(Math.random() * 60) + 30,
          sleep: {
            duration: Math.floor(Math.random() * 120) + 420, // 7-9 hours
            quality: Math.floor(Math.random() * 30) + 70, // 70-100%
            stages: {
              deep: Math.floor(Math.random() * 60) + 60,
              light: Math.floor(Math.random() * 180) + 180,
              rem: Math.floor(Math.random() * 90) + 60,
              awake: Math.floor(Math.random() * 30) + 10
            },
            efficiency: Math.floor(Math.random() * 20) + 80
          }
        }
      };
    }
  },
  googleFit: {
    name: 'Google Fit',
    type: 'google_fit',
    checkAvailability: () => typeof window !== 'undefined' && 'gapi' in window,
    connect: async () => {
      // Mock Google Fit connection
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1500);
      });
    },
    fetchData: async (): Promise<DeviceData> => {
      // Mock Google Fit data
      return {
        deviceId: 'google_fit_mock',
        timestamp: new Date().toISOString(),
        metrics: {
          steps: Math.floor(Math.random() * 6000) + 4000,
          heartRate: Math.floor(Math.random() * 35) + 55,
          calories: Math.floor(Math.random() * 400) + 1600,
          distance: Math.floor(Math.random() * 2500) + 1500,
          activeMinutes: Math.floor(Math.random() * 45) + 25
        }
      };
    }
  },
  fitbit: {
    name: 'Fitbit',
    type: 'fitbit',
    checkAvailability: () => true, // Fitbit Web API
    connect: async () => {
      // Mock Fitbit connection
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1200);
      });
    },
    fetchData: async (): Promise<DeviceData> => {
      // Mock Fitbit data
      return {
        deviceId: 'fitbit_mock',
        timestamp: new Date().toISOString(),
        metrics: {
          steps: Math.floor(Math.random() * 7000) + 3000,
          heartRate: Math.floor(Math.random() * 45) + 50,
          calories: Math.floor(Math.random() * 600) + 1400,
          distance: Math.floor(Math.random() * 2000) + 1000,
          activeMinutes: Math.floor(Math.random() * 40) + 20,
          sleep: {
            duration: Math.floor(Math.random() * 90) + 390,
            quality: Math.floor(Math.random() * 25) + 65,
            stages: {
              deep: Math.floor(Math.random() * 50) + 40,
              light: Math.floor(Math.random() * 160) + 140,
              rem: Math.floor(Math.random() * 80) + 40,
              awake: Math.floor(Math.random() * 40) + 20
            },
            efficiency: Math.floor(Math.random() * 15) + 75
          }
        }
      };
    }
  },
  garmin: {
    name: 'Garmin Connect',
    type: 'garmin',
    checkAvailability: () => true,
    connect: async () => {
      // Mock Garmin connection
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1800);
      });
    },
    fetchData: async (): Promise<DeviceData> => {
      // Mock Garmin data
      return {
        deviceId: 'garmin_mock',
        timestamp: new Date().toISOString(),
        metrics: {
          steps: Math.floor(Math.random() * 8000) + 2000,
          heartRate: Math.floor(Math.random() * 50) + 45,
          calories: Math.floor(Math.random() * 700) + 1300,
          distance: Math.floor(Math.random() * 3000) + 500,
          activeMinutes: Math.floor(Math.random() * 50) + 15
        }
      };
    }
  }
};

export function useWearableDevices() {
  const [connections, setConnections] = useState<WearableConnection[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Initialize available devices
  useEffect(() => {
    const availableDevices: WearableDevice[] = Object.entries(WEARABLE_APIS).map(([key, api]) => ({
      id: key,
      name: api.name,
      type: api.type as WearableDevice['type'],
      brand: api.name.split(' ')[0],
      model: 'Web API',
      isConnected: false,
      supportedMetrics: ['steps', 'heartRate', 'calories', 'distance', 'activeMinutes'],
      batteryLevel: Math.floor(Math.random() * 100)
    }));

    setConnections(availableDevices.map(device => ({
      device,
      isConnected: false
    })));
  }, []);

  // Scan for available devices
  const scanForDevices = useCallback(async () => {
    setIsScanning(true);
    setError(null);

    try {
      // Simulate device scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check availability of each API
      const updatedConnections = connections.map(conn => {
        const api = WEARABLE_APIS[conn.device.type as keyof typeof WEARABLE_APIS];
        return {
          ...conn,
          device: {
            ...conn.device,
            isConnected: api.checkAvailability()
          }
        };
      });

      setConnections(updatedConnections);
    } catch (err) {
      setError('Failed to scan for devices');
    } finally {
      setIsScanning(false);
    }
  }, [connections]);

  // Connect to a device
  const connectDevice = useCallback(async (deviceId: string) => {
    setError(null);
    setSyncProgress(0);

    try {
      const api = WEARABLE_APIS[deviceId as keyof typeof WEARABLE_APIS];
      
      if (!api) {
        throw new Error('Device not supported');
      }

      setSyncProgress(25);
      await api.connect();
      setSyncProgress(50);

      // Update connection status
      setConnections(prev => prev.map(conn => 
        conn.device.id === deviceId 
          ? { 
              ...conn, 
              isConnected: true, 
              lastSync: new Date().toISOString(),
              error: undefined 
            }
          : conn
      ));

      setSyncProgress(100);
      setLastSync(new Date().toISOString());
      
      // Reset progress after a delay
      setTimeout(() => setSyncProgress(0), 1000);
    } catch (err) {
      setError(`Failed to connect to device: ${err}`);
      setConnections(prev => prev.map(conn => 
        conn.device.id === deviceId 
          ? { ...conn, error: 'Connection failed' }
          : conn
      ));
      setSyncProgress(0);
    }
  }, []);

  // Disconnect from a device
  const disconnectDevice = useCallback(async (deviceId: string) => {
    try {
      setConnections(prev => prev.map(conn => 
        conn.device.id === deviceId 
          ? { ...conn, isConnected: false, lastSync: undefined }
          : conn
      ));
    } catch (err) {
      setError(`Failed to disconnect: ${err}`);
    }
  }, []);

  // Sync data from all connected devices
  const syncAllDevices = useCallback(async () => {
    const connectedDevices = connections.filter(conn => conn.isConnected);
    
    if (connectedDevices.length === 0) {
      setError('No devices connected');
      return [];
    }

    setError(null);
    const allData: DeviceData[] = [];

    for (let i = 0; i < connectedDevices.length; i++) {
      const conn = connectedDevices[i];
      const api = WEARABLE_APIS[conn.device.type as keyof typeof WEARABLE_APIS];
      
      try {
        setSyncProgress(Math.round(((i + 1) / connectedDevices.length) * 100));
        const data = await api.fetchData();
        allData.push(data);
        
        // Update last sync time
        setConnections(prev => prev.map(c => 
          c.device.id === conn.device.id 
            ? { ...c, lastSync: new Date().toISOString() }
            : c
        ));
      } catch (err) {
        console.error(`Failed to sync ${conn.device.name}:`, err);
      }
    }

    setLastSync(new Date().toISOString());
    setTimeout(() => setSyncProgress(0), 1000);
    
    return allData;
  }, [connections]);

  // Get aggregated data from all devices
  const getAggregatedData = useCallback(async () => {
    const deviceData = await syncAllDevices();
    
    if (deviceData.length === 0) return null;

    // Aggregate metrics from all devices
    const aggregated: DeviceData = {
      deviceId: 'aggregated',
      timestamp: new Date().toISOString(),
      metrics: {
        steps: Math.max(...deviceData.map(d => d.metrics.steps || 0)),
        heartRate: Math.round(deviceData.reduce((sum, d) => sum + (d.metrics.heartRate || 0), 0) / deviceData.length),
        calories: Math.max(...deviceData.map(d => d.metrics.calories || 0)),
        distance: Math.max(...deviceData.map(d => d.metrics.distance || 0)),
        activeMinutes: Math.max(...deviceData.map(d => d.metrics.activeMinutes || 0)),
        sleep: deviceData.find(d => d.metrics.sleep)?.metrics.sleep
      }
    };

    return aggregated;
  }, [syncAllDevices]);

  // Get device-specific data
  const getDeviceData = useCallback(async (deviceId: string) => {
    const api = WEARABLE_APIS[deviceId as keyof typeof WEARABLE_APIS];
    
    if (!api) {
      throw new Error('Device not supported');
    }

    return await api.fetchData();
  }, []);

  // Get sleep insights
  const getSleepInsights = useCallback(async (): Promise<string[]> => {
    const deviceData = await syncAllDevices();
    const sleepData = deviceData
      .map(d => d.metrics.sleep)
      .filter(Boolean) as SleepData[];

    if (sleepData.length === 0) return [];

    const insights: string[] = [];
    const avgSleep = sleepData.reduce((sum, sleep) => sum + sleep.duration, 0) / sleepData.length;
    const avgQuality = sleepData.reduce((sum, sleep) => sum + sleep.quality, 0) / sleepData.length;

    if (avgSleep < 420) { // Less than 7 hours
      insights.push('You\'re averaging less than 7 hours of sleep. Try to establish a consistent bedtime routine.');
    } else if (avgSleep > 540) { // More than 9 hours
      insights.push('You\'re sleeping more than 9 hours on average. This might indicate you need more rest.');
    }

    if (avgQuality < 70) {
      insights.push('Your sleep quality could be improved. Consider reducing screen time before bed.');
    } else if (avgQuality > 85) {
      insights.push('Great sleep quality! Keep up your excellent sleep habits.');
    }

    return insights;
  }, [syncAllDevices]);

  // Get activity insights
  const getActivityInsights = useCallback(async (): Promise<string[]> => {
    const deviceData = await syncAllDevices();
    
    if (deviceData.length === 0) return [];

    const insights: string[] = [];
    const totalSteps = Math.max(...deviceData.map(d => d.metrics.steps || 0));
    const totalActiveMinutes = Math.max(...deviceData.map(d => d.metrics.activeMinutes || 0));

    if (totalSteps < 5000) {
      insights.push('You\'re below the recommended 10,000 steps daily. Try to incorporate more walking into your routine.');
    } else if (totalSteps > 12000) {
      insights.push('Excellent! You\'re exceeding the daily step goal. Keep up the great work!');
    }

    if (totalActiveMinutes < 30) {
      insights.push('Try to aim for at least 30 minutes of moderate activity daily.');
    } else if (totalActiveMinutes > 60) {
      insights.push('Great job staying active! You\'re meeting recommended activity levels.');
    }

    return insights;
  }, [syncAllDevices]);

  return {
    connections,
    isScanning,
    lastSync,
    syncProgress,
    error,
    scanForDevices,
    connectDevice,
    disconnectDevice,
    syncAllDevices,
    getAggregatedData,
    getDeviceData,
    getSleepInsights,
    getActivityInsights
  };
}
