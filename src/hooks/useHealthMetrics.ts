import { useState, useEffect, useCallback } from 'react';
import { HealthMetrics, BloodPressureReading, GlucoseReading, WeightEntry } from '@/types/health';

const METRICS_KEY = 'nirogcare_metrics';

export function useHealthMetrics() {
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load metrics from localStorage on mount
  useEffect(() => {
    try {
      const storedMetrics = localStorage.getItem(METRICS_KEY);
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
    } catch (err) {
      setError('Failed to load health metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save metrics to localStorage whenever they change
  const saveMetrics = useCallback((updatedMetrics: HealthMetrics[]) => {
    try {
      localStorage.setItem(METRICS_KEY, JSON.stringify(updatedMetrics));
      setMetrics(updatedMetrics);
    } catch (err) {
      setError('Failed to save metrics');
    }
  }, []);

  // Add new metric
  const addMetric = useCallback((metric: Omit<HealthMetrics, 'id' | 'userId'>) => {
    const newMetric: HealthMetrics = {
      ...metric,
      id: Date.now().toString(),
      userId: 'current_user' // In real app, this would come from auth
    };
    
    const updatedMetrics = [...metrics, newMetric];
    saveMetrics(updatedMetrics);
  }, [metrics, saveMetrics]);

  // Add blood pressure reading
  const addBloodPressure = useCallback((reading: Omit<BloodPressureReading, 'timestamp'>) => {
    const newMetric: HealthMetrics = {
      id: Date.now().toString(),
      userId: 'current_user',
      timestamp: new Date().toISOString(),
      type: 'blood_pressure',
      value: { systolic: reading.systolic, diastolic: reading.diastolic },
      unit: 'mmHg',
      notes: reading.notes
    };
    
    const updatedMetrics = [...metrics, newMetric];
    saveMetrics(updatedMetrics);
  }, [metrics, saveMetrics]);

  // Add glucose reading
  const addGlucoseReading = useCallback((reading: Omit<GlucoseReading, 'timestamp'>) => {
    const newMetric: HealthMetrics = {
      id: Date.now().toString(),
      userId: 'current_user',
      timestamp: new Date().toISOString(),
      type: 'glucose',
      value: reading.value,
      unit: reading.unit,
      notes: `${reading.type} reading${reading.notes ? ': ' + reading.notes : ''}`
    };
    
    const updatedMetrics = [...metrics, newMetric];
    saveMetrics(updatedMetrics);
  }, [metrics, saveMetrics]);

  // Add weight entry
  const addWeightEntry = useCallback((entry: Omit<WeightEntry, 'timestamp'>) => {
    const newMetric: HealthMetrics = {
      id: Date.now().toString(),
      userId: 'current_user',
      timestamp: new Date().toISOString(),
      type: 'weight',
      value: entry.weight,
      unit: 'kg',
      notes: entry.notes ? `${entry.notes}${entry.bodyFat ? `, Body Fat: ${entry.bodyFat}%` : ''}${entry.muscleMass ? `, Muscle Mass: ${entry.muscleMass}kg` : ''}` : undefined
    };
    
    const updatedMetrics = [...metrics, newMetric];
    saveMetrics(updatedMetrics);
  }, [metrics, saveMetrics]);

  // Get metrics by type
  const getMetricsByType = useCallback((type: HealthMetrics['type']) => {
    return metrics.filter(metric => metric.type === type);
  }, [metrics]);

  // Get recent metrics (last 30 days)
  const getRecentMetrics = useCallback((days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return metrics.filter(metric => new Date(metric.timestamp) >= cutoffDate);
  }, [metrics]);

  // Get latest reading for each metric type
  const getLatestReadings = useCallback(() => {
    const latestReadings: Record<string, HealthMetrics> = {};
    
    metrics.forEach(metric => {
      if (!latestReadings[metric.type] || new Date(metric.timestamp) > new Date(latestReadings[metric.type].timestamp)) {
        latestReadings[metric.type] = metric;
      }
    });
    
    return latestReadings;
  }, [metrics]);

  // Delete metric
  const deleteMetric = useCallback((metricId: string) => {
    const updatedMetrics = metrics.filter(metric => metric.id !== metricId);
    saveMetrics(updatedMetrics);
  }, [metrics, saveMetrics]);

  // Get blood pressure trend
  const getBloodPressureTrend = useCallback(() => {
    const bpMetrics = getMetricsByType('blood_pressure')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-7); // Last 7 readings
    
    return bpMetrics.map(metric => ({
      date: new Date(metric.timestamp).toLocaleDateString(),
      systolic: (metric.value as { systolic: number; diastolic: number }).systolic,
      diastolic: (metric.value as { systolic: number; diastolic: number }).diastolic
    }));
  }, [getMetricsByType]);

  // Get glucose trend
  const getGlucoseTrend = useCallback(() => {
    const glucoseMetrics = getMetricsByType('glucose')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-14); // Last 14 readings
    
    return glucoseMetrics.map(metric => ({
      date: new Date(metric.timestamp).toLocaleDateString(),
      value: metric.value as number,
      type: metric.notes?.includes('fasting') ? 'fasting' : 
            metric.notes?.includes('post_meal') ? 'post_meal' : 'random'
    }));
  }, [getMetricsByType]);

  // Get weight trend
  const getWeightTrend = useCallback(() => {
    const weightMetrics = getMetricsByType('weight')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-30); // Last 30 readings
    
    return weightMetrics.map(metric => ({
      date: new Date(metric.timestamp).toLocaleDateString(),
      weight: metric.value as number
    }));
  }, [getMetricsByType]);

  // Export data for sharing with doctors
  const exportData = useCallback(() => {
    const exportData = {
      metrics,
      exportDate: new Date().toISOString(),
      totalReadings: metrics.length,
      dateRange: {
        from: metrics.length > 0 ? metrics[0].timestamp : null,
        to: metrics.length > 0 ? metrics[metrics.length - 1].timestamp : null
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `health-metrics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [metrics]);

  return {
    metrics,
    loading,
    error,
    addMetric,
    addBloodPressure,
    addGlucoseReading,
    addWeightEntry,
    getMetricsByType,
    getRecentMetrics,
    getLatestReadings,
    getBloodPressureTrend,
    getGlucoseTrend,
    getWeightTrend,
    deleteMetric,
    exportData
  };
}
