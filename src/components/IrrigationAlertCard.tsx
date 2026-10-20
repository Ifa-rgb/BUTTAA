import React, { useState, useEffect, useMemo } from 'react';
import {
  SoilMoistureSensor,
  IrrigationAlert,
  WeatherData,
  ScreenId,
  FarmTaskLog
} from '../types';
import {
  Droplets,
  CloudSun,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  CloudRain,
  Sun,
  Thermometer,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  Bell,
  Play,
  Square,
  Volume2,
  Check,
  TrendingDown,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { regionalWeather } from '../data/mockData';

interface IrrigationAlertCardProps {
  onNavigate: (screen: ScreenId) => void;
  onAddFarmTaskLog?: (log: Omit<FarmTaskLog, 'id'>) => void;
  onAddNotification?: (notif: {
    title: string;
    body: string;
    type: 'order' | 'weather' | 'market' | 'alert' | 'general';
  }) => void;
  farmerName?: string;
  farmLocation?: string;
}

const INITIAL_SENSORS: SoilMoistureSensor[] = [
  {
    id: 'sensor-01',
    plotId: 'plot-a',
    plotName: 'Block A - High Altitude Terrace',
    crop: 'Arabica Coffee',
    moisturePercent: 26, // Critical deficit
    thresholdMinPercent: 40,
    thresholdMaxPercent: 75,
    soilTempC: 19.5,
    rootDepthCm: 30,
    soilType: 'Volcanic Sandy Loam',
    batteryPercent: 92,
    lastUpdated: '2 mins ago',
    valveStatus: 'Closed'
  },
  {
    id: 'sensor-02',
    plotId: 'plot-b',
    plotName: 'Nursery & Raised Beds',
    crop: 'Roma Tomatoes & Seedlings',
    moisturePercent: 21, // Severe deficit
    thresholdMinPercent: 45,
    thresholdMaxPercent: 80,
    soilTempC: 22.0,
    rootDepthCm: 15,
    soilType: 'Rich Organic Compost Loam',
    batteryPercent: 88,
    lastUpdated: 'Just now',
    valveStatus: 'Closed'
  },
  {
    id: 'sensor-03',
    plotId: 'plot-c',
    plotName: 'Valley Flat Field - Section 2',
    crop: 'Hybrid Maize (BH-661)',
    moisturePercent: 54, // Optimal
    thresholdMinPercent: 40,
    thresholdMaxPercent: 70,
    soilTempC: 20.2,
    rootDepthCm: 25,
    soilType: 'Alluvial Heavy Loam',
    batteryPercent: 95,
    lastUpdated: '5 mins ago',
    valveStatus: 'Closed'
  },
  {
    id: 'sensor-04',
    plotId: 'plot-d',
    plotName: 'Ada\'a Loam Plot B',
    crop: 'Pure White Teff',
    moisturePercent: 35, // Mild deficit
    thresholdMinPercent: 38,
    thresholdMaxPercent: 68,
    soilTempC: 21.4,
    rootDepthCm: 12,
    soilType: 'Vertisol (Black Cotton Clay)',
    batteryPercent: 91,
    lastUpdated: '1 min ago',
    valveStatus: 'Closed'
  }
];

type WeatherScenario = 'dry_warm' | 'rain_imminent' | 'heatwave';

export const IrrigationAlertCard: React.FC<IrrigationAlertCardProps> = ({
  onNavigate,
  onAddFarmTaskLog,
  onAddNotification,
  farmerName = 'Abebe Bikila',
  farmLocation = 'Jimma Zone, Oromia'
}) => {
  const [sensors, setSensors] = useState<SoilMoistureSensor[]>(INITIAL_SENSORS);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('sensor-01');
  const [weatherScenario, setWeatherScenario] = useState<WeatherScenario>('dry_warm');
  const [isSimulatingValve, setIsSimulatingValve] = useState<boolean>(false);
  const [valveSecondsLeft, setValveSecondsLeft] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const selectedSensor = useMemo(() => {
    return sensors.find((s) => s.id === selectedSensorId) || sensors[0];
  }, [sensors, selectedSensorId]);

  // Audio tone helper
  const playAlertChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio fallback
    }
  };

  // Automated irrigation intelligence calculator
  const alertAnalysis = useMemo<IrrigationAlert>(() => {
    const moisture = selectedSensor.moisturePercent;
    const minThreshold = selectedSensor.thresholdMinPercent;

    if (weatherScenario === 'rain_imminent') {
      return {
        id: `alert-rain-${selectedSensor.id}`,
        plotName: selectedSensor.plotName,
        crop: selectedSensor.crop,
        urgency: 'Rain Postponed',
        optimalTimeWindow: 'Postpone — Rain Imminent (3h)',
        secondaryTimeWindow: 'Re-evaluate tomorrow morning',
        recommendedDurationHours: 0,
        recommendedLiters: 0,
        waterMethod: 'Drip Irrigation',
        evaporationLossPercent: 0,
        reasoning:
          'Local radar detects heavy rain showers (85% probability, ~20mm precipitation) arriving in ~3 hours. Withholding automated irrigation avoids soil waterlogging and prevents costly nitrogen fertilizer leaching.',
        savingsEtb: 480
      };
    }

    if (moisture < minThreshold) {
      const isCritical = moisture <= minThreshold - 10;
      const liters = selectedSensor.crop.includes('Coffee') ? 4000 : 3200;
      const hours = selectedSensor.crop.includes('Coffee') ? 2.5 : 2.0;

      if (weatherScenario === 'heatwave') {
        return {
          id: `alert-heat-${selectedSensor.id}`,
          plotName: selectedSensor.plotName,
          crop: selectedSensor.crop,
          urgency: 'Critical',
          optimalTimeWindow: 'Today: 05:30 AM – 07:30 AM (Dawn)',
          secondaryTimeWindow: 'Today: 06:15 PM – 07:45 PM (Post-Sunset)',
          recommendedDurationHours: hours,
          recommendedLiters: liters,
          waterMethod: 'Drip Irrigation',
          evaporationLossPercent: 5,
          reasoning:
            'Extreme heatwave forecast (31°C+ peak at midday). Midday watering causes severe thermal shock and 44% immediate evaporative loss. Irrigate strictly at dawn before direct sun reaches the foliage to ensure deep root uptake.',
          savingsEtb: 620
        };
      }

      // Default dry_warm
      return {
        id: `alert-dry-${selectedSensor.id}`,
        plotName: selectedSensor.plotName,
        crop: selectedSensor.crop,
        urgency: isCritical ? 'Critical' : 'Warning',
        optimalTimeWindow: 'Today: 06:00 AM – 08:30 AM (Morning)',
        secondaryTimeWindow: 'Today: 05:45 PM – 07:15 PM (Evening)',
        recommendedDurationHours: hours,
        recommendedLiters: liters,
        waterMethod: 'Drip Irrigation',
        evaporationLossPercent: 6,
        reasoning:
          'Soil moisture is below optimal crop threshold with ambient morning temp at 19°C–21°C and low wind (7 km/h). Applying drip irrigation during this window maximizes water infiltration to 30cm root depth and reduces evaporative waste by 38% compared to midday.',
        savingsEtb: 450
      };
    }

    return {
      id: `alert-ok-${selectedSensor.id}`,
      plotName: selectedSensor.plotName,
      crop: selectedSensor.crop,
      urgency: 'Optimal',
      optimalTimeWindow: 'No Irrigation Needed Today',
      secondaryTimeWindow: 'Next scheduled cycle in 2 days',
      recommendedDurationHours: 0,
      recommendedLiters: 0,
      waterMethod: 'Drip Irrigation',
      evaporationLossPercent: 0,
      reasoning:
        'Soil moisture sensor is well within the healthy root zone range (54% vs 40% minimum). Additional irrigation would waste water and energy.',
      savingsEtb: 0
    };
  }, [selectedSensor, weatherScenario]);

  // Simulated Valve Cycle Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingValve && valveSecondsLeft > 0) {
      timer = setTimeout(() => {
        setValveSecondsLeft((prev) => prev - 1);
        // Increment moisture smoothly
        setSensors((prev) =>
          prev.map((s) => {
            if (s.id === selectedSensorId) {
              const newMoisture = Math.min(s.moisturePercent + 3, 62);
              return {
                ...s,
                moisturePercent: newMoisture,
                valveStatus: 'Open (Irrigating)',
                lastUpdated: 'Streaming live telemetry'
              };
            }
            return s;
          })
        );
      }, 1000);
    } else if (isSimulatingValve && valveSecondsLeft === 0) {
      setIsSimulatingValve(false);
      setSensors((prev) =>
        prev.map((s) =>
          s.id === selectedSensorId
            ? { ...s, valveStatus: 'Closed', lastUpdated: 'Irrigation completed just now' }
            : s
        )
      );
      playAlertChime();
      setToastMessage(`💧 Automated drip cycle finished for ${selectedSensor.plotName}! Soil moisture replenished.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
    return () => clearTimeout(timer);
  }, [isSimulatingValve, valveSecondsLeft, selectedSensorId, selectedSensor.plotName]);

  // Start valve demo
  const handleStartSimulatedValve = () => {
    playAlertChime();
    setIsSimulatingValve(true);
    setValveSecondsLeft(12);
    setToastMessage(`⚡ Smart Drip Valve OPEN for ${selectedSensor.crop} (${selectedSensor.plotName}). Telemetry streaming...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Refresh Telemetry Probe
  const handleRefreshSensors = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          lastUpdated: 'Just now (Probe verified)'
        }))
      );
      setToastMessage('✅ IoT Soil Sensor telemetry refreshed from field gateway.');
      setTimeout(() => setToastMessage(null), 2500);
    }, 600);
  };

  // Schedule to Farm Task Logs
  const handleAutoSchedule = () => {
    playAlertChime();
    const todayStr = new Date().toISOString().split('T')[0];

    if (onAddFarmTaskLog) {
      onAddFarmTaskLog({
        farmerId: 'u-101',
        activityType: 'Watering',
        crop: selectedSensor.crop,
        plotName: selectedSensor.plotName,
        date: todayStr,
        time: alertAnalysis.optimalTimeWindow.includes('05:30')
          ? '05:30 AM'
          : alertAnalysis.optimalTimeWindow.includes('06:00')
          ? '06:00 AM'
          : '06:30 AM',
        status: 'Scheduled',
        priority: alertAnalysis.urgency === 'Critical' ? 'High' : 'Medium',
        durationHours: alertAnalysis.recommendedDurationHours || 2,
        workersCount: 1,
        quantityOrMetric: `${alertAnalysis.recommendedLiters.toLocaleString()} L (${alertAnalysis.waterMethod})`,
        costETB: 250,
        weather: `Automated: ${weatherScenario === 'heatwave' ? 'Heatwave Avoidance' : 'Morning Cool Window'}`,
        notes: `Automated irrigation recommendation: Current soil moisture was ${selectedSensor.moisturePercent}% (Min threshold ${selectedSensor.thresholdMinPercent}%). Window ${alertAnalysis.optimalTimeWindow} selected to save ~${alertAnalysis.savingsEtb} ETB in diesel/water.`,
        isOrganicCertified: true
      });
    }

    if (onAddNotification) {
      onAddNotification({
        title: `Irrigation Scheduled: ${selectedSensor.crop}`,
        body: `Optimal watering window (${alertAnalysis.optimalTimeWindow}) auto-scheduled in Farm Task Logs for ${selectedSensor.plotName}.`,
        type: 'alert'
      });
    }

    setToastMessage(
      `📅 Auto-scheduled ${selectedSensor.crop} irrigation for ${alertAnalysis.optimalTimeWindow} in Farm Task Logs!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Push Alert to Notification Tray
  const handlePushNotificationAlert = () => {
    playAlertChime();
    if (onAddNotification) {
      onAddNotification({
        title: `Irrigation Alert: ${alertAnalysis.urgency.toUpperCase()} (${selectedSensor.crop})`,
        body: `${selectedSensor.plotName} soil moisture is ${selectedSensor.moisturePercent}%. Suggested window: ${alertAnalysis.optimalTimeWindow}.`,
        type: 'alert'
      });
    }
    setToastMessage(`🔔 Automated alert sent to app notifications tray for ${selectedSensor.crop}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick preset moisture simulation
  const handleSetMoisture = (val: number) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === selectedSensorId ? { ...s, moisturePercent: val } : s))
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-5 relative overflow-hidden">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-sky-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4">
          <Droplets className="w-4 h-4 text-sky-400 shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-sky-100 text-sky-800">
              <Droplets className="w-5 h-5 text-sky-600" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Automated Smart Irrigation & Soil Sensor Alerts
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                  Live IoT Sim
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI-driven optimal watering windows computed from real-time local weather & root-zone soil telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshSensors}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-sky-700 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1.5 transition-colors"
            title="Scan field sensor probes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
            <span className="hidden sm:inline">Refresh Telemetry</span>
          </button>

          <button
            onClick={handlePushNotificationAlert}
            className="bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-transform active:scale-95"
            title="Send alert to notification tray"
          >
            <Bell className="w-3.5 h-3.5 text-sky-600" />
            <span>Push Alert</span>
          </button>
        </div>
      </div>

      {/* Plot Sensor Selector Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-700 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Select Farm Plot Sensor:</span>
          </span>
          <span className="text-[11px] text-slate-400">4 Probes Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sensors.map((sensor) => {
            const isSelected = sensor.id === selectedSensorId;
            const isDeficit = sensor.moisturePercent < sensor.thresholdMinPercent;
            return (
              <button
                key={sensor.id}
                onClick={() => setSelectedSensorId(sensor.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-sky-900 text-white border-sky-900 shadow-md ring-2 ring-sky-400/30'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase truncate ${
                      isSelected ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  >
                    {sensor.crop}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDeficit ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                    }`}
                  ></span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span
                    className={`text-lg font-black ${
                      isSelected
                        ? 'text-white'
                        : isDeficit
                        ? 'text-rose-600 font-black'
                        : 'text-slate-900'
                    }`}
                  >
                    {sensor.moisturePercent}%
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    Min: {sensor.thresholdMinPercent}%
                  </span>
                </div>
                <span
                  className={`text-[10px] truncate block mt-0.5 ${
                    isSelected ? 'text-sky-100' : 'text-slate-500'
                  }`}
                >
                  {sensor.plotName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Alert & Suggestion Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all space-y-4 ${
          alertAnalysis.urgency === 'Critical'
            ? 'bg-gradient-to-r from-rose-50 via-amber-50/50 to-white border-rose-300 shadow-sm'
            : alertAnalysis.urgency === 'Rain Postponed'
            ? 'bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white border-sky-300 shadow-sm'
            : alertAnalysis.urgency === 'Warning'
            ? 'bg-gradient-to-r from-amber-50 to-white border-amber-300 shadow-sm'
            : 'bg-gradient-to-r from-emerald-50 to-white border-emerald-300 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black shadow-sm ${
                alertAnalysis.urgency === 'Critical'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : alertAnalysis.urgency === 'Rain Postponed'
                  ? 'bg-sky-600 text-white'
                  : alertAnalysis.urgency === 'Warning'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {alertAnalysis.urgency === 'Rain Postponed' ? (
                <CloudRain className="w-6 h-6" />
              ) : alertAnalysis.urgency === 'Optimal' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <Clock className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    alertAnalysis.urgency === 'Critical'
                      ? 'bg-rose-600 text-white'
                      : alertAnalysis.urgency === 'Rain Postponed'
                      ? 'bg-sky-600 text-white'
                      : alertAnalysis.urgency === 'Warning'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {alertAnalysis.urgency === 'Rain Postponed'
                    ? 'Rain Detected — Hold Water'
                    : `${alertAnalysis.urgency} Irrigation Alert`}
                </span>
                <span className="text-xs font-black text-slate-800">
                  {selectedSensor.crop} • {selectedSensor.plotName}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Suggested Optimal Window: <span className="text-sky-800">{alertAnalysis.optimalTimeWindow}</span>
              </h3>
              {alertAnalysis.secondaryTimeWindow && (
                <p className="text-[11px] font-bold text-slate-500">
                  Secondary Alternative: {alertAnalysis.secondaryTimeWindow}
                </p>
              )}
            </div>
          </div>

          {/* Quick Schedule Button */}
          {alertAnalysis.urgency !== 'Optimal' && alertAnalysis.urgency !== 'Rain Postponed' && (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleAutoSchedule}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center space-x-1.5 transition-transform active:scale-95"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Auto-Schedule Task</span>
              </button>
            </div>
          )}
        </div>

        {/* Detailed Agronomic Reasoning Card */}
        <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2 leading-relaxed">
          <div className="flex items-center space-x-1.5 font-black text-slate-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Automated Weather & Soil Agronomic Insight:</span>
          </div>
          <p>{alertAnalysis.reasoning}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-bold">Recommended Water</span>
              <span className="font-extrabold text-slate-900">
                {alertAnalysis.recommendedLiters > 0
                  ? `${alertAnalysis.recommendedLiters.toLocaleString()} Liters`
                  : 'None needed'}
              </span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-bold">Optimal Method</span>
              <span className="font-extrabold text-sky-800">{alertAnalysis.waterMethod}</span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-bold">Evaporation Loss Index</span>
              <span className="font-extrabold text-emerald-700">
                {alertAnalysis.evaporationLossPercent}% (vs 42% Midday)
              </span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] font-bold">Estimated Cost Saved</span>
              <span className="font-extrabold text-amber-800">
                ~{alertAnalysis.savingsEtb} ETB / Cycle
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Sensor Telemetry Probe & Weather Conditions Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Sensor Probe Real-Time Telemetry */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-xs text-slate-900 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Root Zone Telemetry ({selectedSensor.crop})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {selectedSensor.lastUpdated}
            </span>
          </div>

          {/* Moisture Bar Gauge */}
          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Soil Moisture Level</span>
              <span className="font-black text-slate-900">
                {selectedSensor.moisturePercent}%{' '}
                <span
                  className={
                    selectedSensor.moisturePercent < selectedSensor.thresholdMinPercent
                      ? 'text-rose-600 font-black'
                      : 'text-emerald-600 font-bold'
                  }
                >
                  ({selectedSensor.moisturePercent < selectedSensor.thresholdMinPercent ? 'Deficit' : 'Healthy'})
                </span>
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  selectedSensor.moisturePercent < selectedSensor.thresholdMinPercent
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : 'bg-gradient-to-r from-emerald-500 to-sky-500'
                }`}
                style={{ width: `${Math.min(selectedSensor.moisturePercent, 100)}%` }}
              ></div>
              {/* Target minimum threshold marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900"
                style={{ left: `${selectedSensor.thresholdMinPercent}%` }}
                title={`Target Min Threshold: ${selectedSensor.thresholdMinPercent}%`}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Bone Dry)</span>
              <span className="font-bold text-slate-700">Min: {selectedSensor.thresholdMinPercent}%</span>
              <span>100% (Saturated)</span>
            </div>
          </div>

          {/* Key Probe Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-semibold">Soil Temp</span>
              <span className="font-black text-slate-800 text-sm">{selectedSensor.soilTempC}°C</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-semibold">Sensor Depth</span>
              <span className="font-black text-slate-800 text-sm">{selectedSensor.rootDepthCm} cm</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-semibold">Soil Texture</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">
                {selectedSensor.soilType.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Interactive Live Valve Test Button */}
          <div className="pt-1 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isSimulatingValve ? 'bg-sky-500 animate-ping' : 'bg-slate-400'
                }`}
              ></span>
              <span className="font-bold">
                Valve: {isSimulatingValve ? `Active (${valveSecondsLeft}s left)` : 'Closed / Ready'}
              </span>
            </div>

            {isSimulatingValve ? (
              <button
                onClick={() => setIsSimulatingValve(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop Valve</span>
              </button>
            ) : (
              <button
                onClick={handleStartSimulatedValve}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate 12s Drip</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Weather Telemetry & Scenario Simulator */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-xs text-slate-900 flex items-center space-x-1.5">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>Current Weather: {regionalWeather.city} ({farmLocation})</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Station
            </span>
          </div>

          {/* Weather KPI Cards */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-semibold">Ambient Temp</span>
              <span className="font-black text-slate-900 text-sm">
                {weatherScenario === 'heatwave' ? '31°C' : `${regionalWeather.tempC}°C`}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-semibold">Relative Humidity</span>
              <span className="font-black text-slate-900 text-sm">{regionalWeather.humidity}%</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-semibold">Rain Probability</span>
              <span
                className={`font-black text-sm ${
                  weatherScenario === 'rain_imminent' ? 'text-sky-700 font-black' : 'text-slate-900'
                }`}
              >
                {weatherScenario === 'rain_imminent' ? '85%' : '15%'}
              </span>
            </div>
          </div>

          {/* Weather Simulator Scenarios */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>Test Simulated Weather Scenarios:</span>
              <span className="text-[10px] text-slate-400">Click to switch logic</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => setWeatherScenario('dry_warm')}
                className={`p-2 rounded-xl border font-bold text-[11px] flex items-center justify-center space-x-1 transition-all ${
                  weatherScenario === 'dry_warm'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-600" />
                <span>Mild Sun (24°C)</span>
              </button>

              <button
                onClick={() => setWeatherScenario('rain_imminent')}
                className={`p-2 rounded-xl border font-bold text-[11px] flex items-center justify-center space-x-1 transition-all ${
                  weatherScenario === 'rain_imminent'
                    ? 'bg-sky-100 text-sky-900 border-sky-300 font-black'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CloudRain className="w-3 h-3 text-sky-600" />
                <span>Rain in 3h (85%)</span>
              </button>

              <button
                onClick={() => setWeatherScenario('heatwave')}
                className={`p-2 rounded-xl border font-bold text-[11px] flex items-center justify-center space-x-1 transition-all ${
                  weatherScenario === 'heatwave'
                    ? 'bg-rose-100 text-rose-900 border-rose-300 font-black'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Thermometer className="w-3 h-3 text-rose-600" />
                <span>Heatwave (31°C)</span>
              </button>
            </div>
          </div>

          {/* Quick Moisture Adjuster Buttons for Demonstration */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
            <span>Test Probe Moisture:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleSetMoisture(18)}
                className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-rose-700 hover:bg-rose-50"
              >
                Dry (18%)
              </button>
              <button
                onClick={() => handleSetMoisture(26)}
                className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-amber-700 hover:bg-amber-50"
              >
                Current (26%)
              </button>
              <button
                onClick={() => handleSetMoisture(58)}
                className="bg-white border border-slate-200 px-2 py-0.5 rounded font-bold text-emerald-700 hover:bg-emerald-50"
              >
                Optimal (58%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation link to Farm Task Logs */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-600">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            Scheduled irrigation recommendations directly synchronize with your{' '}
            <strong>Farm Task Logs</strong> daily progress tracking.
          </span>
        </div>

        <button
          onClick={() => onNavigate('farm-task-logs')}
          className="text-emerald-800 hover:text-emerald-950 font-black flex items-center space-x-1 hover:underline ml-auto"
        >
          <span>View All Farm Task Logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
