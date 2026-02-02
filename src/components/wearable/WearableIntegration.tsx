import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Smartphone, Activity, Moon, Battery, Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWearableDevices } from '@/hooks/useWearableDevices';
import { WearableDevice, DeviceData } from '@/types/health';

export default function WearableIntegration() {
  const {
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
    getSleepInsights,
    getActivityInsights
  } = useWearableDevices();

  const [aggregatedData, setAggregatedData] = useState<DeviceData | null>(null);
  const [insights, setInsights] = useState<{ sleep: string[]; activity: string[] }>({ sleep: [], activity: [] });
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadAggregatedData();
  }, []);

  const loadAggregatedData = async () => {
    try {
      const data = await getAggregatedData();
      setAggregatedData(data);
      
      if (data) {
        const [sleepInsights, activityInsights] = await Promise.all([
          getSleepInsights(),
          getActivityInsights()
        ]);
        setInsights({ sleep: sleepInsights, activity: activityInsights });
      }
    } catch (err) {
      console.error('Failed to load aggregated data:', err);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await loadAggregatedData();
    } finally {
      setIsSyncing(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_health':
      case 'google_fit':
        return <Smartphone className="w-5 h-5" />;
      case 'fitbit':
      case 'garmin':
        return <Watch className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-500';
    if (level > 60) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wearable Integration</h2>
          <p className="text-muted-foreground">
            Connect your fitness trackers and smartwatches for automatic health data sync
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={scanForDevices} disabled={isScanning}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Devices'}
          </Button>
          <Button onClick={handleSync} disabled={isSyncing || connections.filter(c => c.isConnected).length === 0}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync All'}
          </Button>
        </div>
      </div>

      {/* Sync Progress */}
      {syncProgress > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium">Syncing devices...</p>
                <Progress value={syncProgress} className="mt-2" />
              </div>
              <span className="text-sm text-muted-foreground">{syncProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected Devices */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Available Devices</h3>
        {connections.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Devices Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Scan for available wearable devices to get started
              </p>
              <Button onClick={scanForDevices} disabled={isScanning}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                Scan for Devices
              </Button>
            </CardContent>
          </Card>
        ) : (
          connections.map((connection) => (
            <motion.div
              key={connection.device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: connections.indexOf(connection) * 0.1 }}
            >
              <Card className={connection.isConnected ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        connection.isConnected ? 'bg-green-100' : 'bg-muted'
                      }`}>
                        {getDeviceIcon(connection.device.type)}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{connection.device.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {connection.device.brand} • {connection.device.model}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {connection.isConnected ? (
                            <>
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                              {connection.lastSync && (
                                <span className="text-xs text-muted-foreground">
                                  Last sync: {formatTime(connection.lastSync)}
                                </span>
                              )}
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <WifiOff className="w-3 h-3 mr-1" />
                              Disconnected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {connection.device.batteryLevel && (
                        <div className="flex items-center gap-1">
                          <Battery className={`w-4 h-4 ${getBatteryColor(connection.device.batteryLevel)}`} />
                          <span className="text-sm">{connection.device.batteryLevel}%</span>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant={connection.isConnected ? "outline" : "default"}
                        onClick={() => connection.isConnected 
                          ? disconnectDevice(connection.device.id)
                          : connectDevice(connection.device.id)
                        }
                      >
                        {connection.isConnected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>

                  {/* Supported Metrics */}
                  {connection.isConnected && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Supported Metrics:</p>
                      <div className="flex flex-wrap gap-2">
                        {connection.device.supportedMetrics.map((metric) => (
                          <Badge key={metric} variant="outline" className="text-xs">
                            {metric.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Aggregated Data */}
      {aggregatedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Today's Health Data
              {lastSync && (
                <span className="text-sm font-normal text-muted-foreground">
                  • Updated {formatTime(lastSync)}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {aggregatedData.metrics.steps?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-muted-foreground">Steps</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {aggregatedData.metrics.heartRate || 0}
                </div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {aggregatedData.metrics.calories?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {aggregatedData.metrics.activeMinutes || 0}
                </div>
                <p className="text-sm text-muted-foreground">Active Minutes</p>
              </div>
            </div>

            {/* Sleep Data */}
            {aggregatedData.metrics.sleep && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Sleep Data</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">
                      {formatDuration(aggregatedData.metrics.sleep.duration)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quality</p>
                    <p className="font-semibold">{aggregatedData.metrics.sleep.quality}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deep Sleep</p>
                    <p className="font-semibold">{formatDuration(aggregatedData.metrics.sleep.stages.deep)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="font-semibold">{aggregatedData.metrics.sleep.efficiency}%</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Health Insights */}
      {(insights.sleep.length > 0 || insights.activity.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Health Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.activity.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activity Insights
                </h4>
                <ul className="space-y-1">
                  {insights.activity.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.sleep.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Sleep Insights
                </h4>
                <ul className="space-y-1">
                  {insights.sleep.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
