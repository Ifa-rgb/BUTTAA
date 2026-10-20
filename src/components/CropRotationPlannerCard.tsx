import React, { useState, useMemo } from 'react';
import {
  SoilDataProfile,
  HarvestHistoryRecord,
  CropRotationPlanRecommendation,
  FarmTaskLog,
  ScreenId,
  TaskPriority
} from '../types';
import {
  Sprout,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Check,
  RefreshCw,
  Share2,
  ChevronRight,
  FileSpreadsheet,
  Download,
  Flame,
  Clock,
  Droplets,
  FlaskConical,
  Wheat,
  Activity,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import {
  initialSoilProfiles,
  historicalHarvests,
  initialCropRotationRecommendations
} from '../data/mockData';

interface CropRotationPlannerCardProps {
  farmTaskLogs?: FarmTaskLog[];
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

// Alternative crops available for what-if simulation
const SIMULATION_CROPS: {
  name: string;
  category: 'Legume / Nitrogen Fixer' | 'Heavy Feeder' | 'Light Feeder / Grain' | 'Root / Tuber' | 'Cover / Green Manure';
  nitrogenImpactKgHa: number;
  somImpact: string;
  durationDays: number;
  estRevenueETB: number;
  family: string;
  description: string;
}[] = [
  {
    name: 'Arerti Kabuli Chickpea',
    category: 'Legume / Nitrogen Fixer',
    nitrogenImpactKgHa: +54,
    somImpact: '+18% Organic Humus',
    durationDays: 105,
    estRevenueETB: 198000,
    family: 'Fabaceae',
    description: 'High-value export legume with deep taproots that break hardpans and fix high atmospheric nitrogen.'
  },
  {
    name: 'Awash-2 Haricot Beans',
    category: 'Legume / Nitrogen Fixer',
    nitrogenImpactKgHa: +48,
    somImpact: '+15% Soil Nitrogen',
    durationDays: 90,
    estRevenueETB: 132000,
    family: 'Fabaceae',
    description: 'Rapid maturity nitrogen fixer that suppresses weeds and restores depleted terrace soils.'
  },
  {
    name: 'Pure White Teff (Quncho)',
    category: 'Light Feeder / Grain',
    nitrogenImpactKgHa: -24,
    somImpact: '+8% Root Fiber',
    durationDays: 110,
    estRevenueETB: 175000,
    family: 'Poaceae',
    description: 'Indigenous staple cereal; shallow fibrous root system with light nitrogen consumption.'
  },
  {
    name: 'Hybrid Maize (BH-661)',
    category: 'Heavy Feeder',
    nitrogenImpactKgHa: -65,
    somImpact: '+20% Stover Biomass',
    durationDays: 135,
    estRevenueETB: 210000,
    family: 'Poaceae',
    description: 'Extremely high nutrient and moisture consumer. Requires heavy organic compost or prior legume cycle.'
  },
  {
    name: 'Red Bombay Onions',
    category: 'Root / Tuber',
    nitrogenImpactKgHa: -15,
    somImpact: '+12% Soil Conditioning',
    durationDays: 95,
    estRevenueETB: 285000,
    family: 'Amaryllidaceae',
    description: 'Natural bio-fumigant crop with sulfur compounds that purge fungal blight and root-knot nematodes.'
  },
  {
    name: 'Crimson Clover Cover Crop',
    category: 'Cover / Green Manure',
    nitrogenImpactKgHa: +42,
    somImpact: '+26% Humus & Living Mulch',
    durationDays: 75,
    estRevenueETB: 95000,
    family: 'Fabaceae',
    description: 'Living green manure that prevents slope erosion, fixes nitrogen, and smothers noxious weeds.'
  }
];

export const CropRotationPlannerCard: React.FC<CropRotationPlannerCardProps> = ({
  farmTaskLogs = [],
  onNavigate,
  onAddFarmTaskLog,
  onAddNotification,
  farmerName = 'IFA SANBATO',
  farmLocation = 'Jimma, Ethiopia'
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-a');
  const [simulatedCropName, setSimulatedCropName] = useState<string>('');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [scheduledSuccessPlotId, setScheduledSuccessPlotId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soilProfiles, setSoilProfiles] = useState<SoilDataProfile[]>(initialSoilProfiles);
  const [isRefreshingSensors, setIsRefreshingSensors] = useState<boolean>(false);

  // Active plot soil profile
  const activeSoilProfile = useMemo(() => {
    return soilProfiles.find((p) => p.plotId === selectedPlotId) || soilProfiles[0];
  }, [soilProfiles, selectedPlotId]);

  // Active plot recommendation
  const activeRecommendation = useMemo(() => {
    return (
      initialCropRotationRecommendations.find((r) => r.plotId === selectedPlotId) ||
      initialCropRotationRecommendations[0]
    );
  }, [selectedPlotId]);

  // Extract recent harvest history from both mockData and live farmTaskLogs
  const recentHarvestsForPlot = useMemo(() => {
    const historical = historicalHarvests.filter((h) => h.plotId === selectedPlotId);

    // Also look at live farm task logs matching this plot name and activityType === 'Harvesting'
    const liveHarvestTasks = farmTaskLogs
      .filter(
        (log) =>
          log.plotName.toLowerCase().includes(activeSoilProfile.plotName.toLowerCase()) ||
          activeSoilProfile.plotName.toLowerCase().includes(log.plotName.toLowerCase())
      )
      .filter((log) => log.activityType === 'Harvesting' || log.activityType === 'Planting');

    return {
      historical,
      liveTasks: liveHarvestTasks
    };
  }, [selectedPlotId, activeSoilProfile.plotName, farmTaskLogs]);

  // Overall farm rotation regeneration index
  const farmSoilHealthAverage = useMemo(() => {
    const sum = soilProfiles.reduce((acc, p) => acc + p.biologicalHealthScore, 0);
    return Math.round(sum / soilProfiles.length);
  }, [soilProfiles]);

  const depletedPlotsCount = useMemo(() => {
    return soilProfiles.filter((p) => p.nitrogenStatus === 'Depleted').length;
  }, [soilProfiles]);

  // Handle schedule planting 1-click action
  const handleSchedulePlanting = (rec: CropRotationPlanRecommendation) => {
    if (onAddFarmTaskLog) {
      onAddFarmTaskLog({
        farmerId: 'u-101',
        activityType: 'Planting',
        crop: rec.recommendedCrop,
        plotName: rec.plotName,
        date: rec.recommendedPlantingDate,
        time: '08:00 AM',
        status: 'Scheduled',
        priority: 'High',
        durationHours: 4.0,
        workersCount: 3,
        quantityOrMetric: `Target Yield: ${rec.projectedYieldQtlHa} Qtl/Ha`,
        costETB: 1200,
        weather: 'Forecast: Post-Rain Clear, 22°C',
        notes: `Automated Crop Rotation Planner: Optimal planting scheduled after ${rec.currentOrPreviousCrop}. Soil Benefit: +${rec.soilBenefits.nitrogenFixationKgHa} kg/ha biological nitrogen.`,
        isOrganicCertified: true
      });
    }

    if (onAddNotification) {
      onAddNotification({
        title: `Planting Scheduled: ${rec.recommendedCrop}`,
        body: `Scheduled for ${rec.plotName} on ${rec.recommendedPlantingDate} to biologically replenish soil nitrogen and break pathogen cycles.`,
        type: 'alert'
      });
    }

    setScheduledSuccessPlotId(rec.plotId);
    setToastMessage(`✓ ${rec.recommendedCrop} scheduled in Farm Task Logs for ${rec.recommendedPlantingDate}!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Re-probe soil sensors with slight variation
  const handleRefreshSoilSensors = () => {
    setIsRefreshingSensors(true);
    setTimeout(() => {
      setSoilProfiles((prev) =>
        prev.map((profile) => {
          if (profile.plotId === selectedPlotId) {
            const jitter = (Math.random() - 0.5) * 4;
            const newN = Math.max(20, Math.round(profile.nitrogenKgHa + jitter));
            return {
              ...profile,
              nitrogenKgHa: newN,
              nitrogenStatus: newN < 40 ? 'Depleted' : newN < 55 ? 'Moderate' : 'Optimal',
              biologicalHealthScore: Math.min(99, Math.round(profile.biologicalHealthScore + (Math.random() > 0.5 ? 1 : -1))),
              lastTestedDate: new Date().toISOString().split('T')[0]
            };
          }
          return profile;
        })
      );
      setIsRefreshingSensors(false);
      setToastMessage(`Soil probe recalibrated for ${activeSoilProfile.plotName}. Latest sensor values updated.`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  // What-if simulated crop computation
  const activeSimulatedCrop = useMemo(() => {
    if (!simulatedCropName) return null;
    return SIMULATION_CROPS.find((c) => c.name === simulatedCropName) || null;
  }, [simulatedCropName]);

  const simulationAnalysis = useMemo(() => {
    if (!activeSimulatedCrop) return null;

    const previousCrop = activeRecommendation.currentOrPreviousCrop.toLowerCase();
    const simName = activeSimulatedCrop.name.toLowerCase();

    // Check dangerous monoculture / same family consecutive planting
    const isConsecutiveMonoculture =
      (previousCrop.includes('maize') && simName.includes('maize')) ||
      (previousCrop.includes('tomato') && simName.includes('tomato')) ||
      (previousCrop.includes('teff') && simName.includes('teff')) ||
      (previousCrop.includes('coffee') && simName.includes('coffee'));

    const netNitrogen = activeSoilProfile.nitrogenKgHa + activeSimulatedCrop.nitrogenImpactKgHa;
    const diseaseRisk = isConsecutiveMonoculture
      ? 'Severe (High pathogen & insect larvae carryover)'
      : activeSimulatedCrop.category === 'Legume / Nitrogen Fixer'
      ? 'Low (Breaks fungal spores & nematode life-cycle)'
      : 'Moderate (Standard field rotation tolerance)';

    const agronomicScore = isConsecutiveMonoculture
      ? 38
      : activeSimulatedCrop.category === 'Legume / Nitrogen Fixer'
      ? 96
      : 74;

    return {
      isConsecutiveMonoculture,
      netNitrogen,
      diseaseRisk,
      agronomicScore
    };
  }, [activeSimulatedCrop, activeRecommendation, activeSoilProfile]);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-900 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg border border-amber-400/50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white text-xs px-1">
            ✕
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-black shadow-xs">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
                <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[11px]">
                  Smart Agro-Planner
                </span>
                <span>•</span>
                <span>Soil-Harvest Synthesis</span>
                <span>•</span>
                <span className="text-slate-700">{farmerName}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Automated Crop Rotation Planner
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed mt-1">
            Synthesizes real-time soil nutrient telemetry (N-P-K, pH, SOM) with logged harvest extraction history to recommend optimal planting schedules, stop soil exhaustion, and break disease cycles.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshSoilSensors}
            disabled={isRefreshingSensors}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-800 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            title="Recalibrate soil sensor probes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingSensors ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Refresh Soil Probe</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-transform active:scale-95"
            title="Export full farm crop rotation plan"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
            <span>Rotation Audit Report</span>
          </button>
        </div>
      </div>

      {/* Farm-wide Soil Health & Depletion Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Farm Soil Regeneration
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-emerald-800">{farmSoilHealthAverage}</span>
            <span className="text-[11px] font-bold text-slate-500">/ 100 Index</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
            Biologically active root zone
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Nitrogen Priority Alert
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-rose-700">{depletedPlotsCount}</span>
            <span className="text-[11px] font-bold text-slate-500">Plots Depleted</span>
          </div>
          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
            Requires Legume N-Fixation
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Target Planting Window
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-sm sm:text-base font-black text-amber-700 truncate">Nov 04 – Dec 05</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
            Post-Meher residual soil moisture
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Est. Bio-Nitrogen Value
          </span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-black text-emerald-800">+48</span>
            <span className="text-[11px] font-bold text-slate-500">kg/Ha N Saved</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
            Replaces synthetic Urea bags
          </span>
        </div>
      </div>

      {/* Plot Selector Tabs */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-600 px-0.5">
          <span className="font-extrabold text-slate-800 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Select Farm Plot for Analysis & Rotation Plan:</span>
          </span>
          <span className="text-[11px] text-slate-400">Click to switch field plot</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {soilProfiles.map((plot) => {
            const isSelected = plot.plotId === selectedPlotId;
            const isDepleted = plot.nitrogenStatus === 'Depleted';
            return (
              <button
                key={plot.plotId}
                onClick={() => {
                  setSelectedPlotId(plot.plotId);
                  setSimulatedCropName('');
                }}
                className={`px-3 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isDepleted ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="truncate max-w-[150px]">{plot.plotName}</span>
                {isDepleted && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      isSelected ? 'bg-rose-500/80 text-white' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    N-Low
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analysis Grid: Soil Telemetry & Previous Harvest History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Soil Nutrient & Sensor Telemetry Analysis */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <FlaskConical className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 text-xs sm:text-sm">
                  Soil Sensor & Lab Diagnostics
                </h3>
                <span className="text-[10px] text-slate-500">
                  {activeSoilProfile.soilType} • Tested {activeSoilProfile.lastTestedDate}
                </span>
              </div>
            </div>

            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                activeSoilProfile.nitrogenStatus === 'Depleted'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : activeSoilProfile.nitrogenStatus === 'Moderate'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              N-Status: {activeSoilProfile.nitrogenStatus}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Nitrogen Bar */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block">Nitrogen (N)</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">
                {activeSoilProfile.nitrogenKgHa}{' '}
                <span className="text-[10px] font-semibold text-slate-500">kg/Ha</span>
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full ${
                    activeSoilProfile.nitrogenKgHa < 40
                      ? 'bg-rose-500'
                      : activeSoilProfile.nitrogenKgHa < 60
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (activeSoilProfile.nitrogenKgHa / 80) * 100)}%` }}
                />
              </div>
            </div>

            {/* Phosphorus / Potassium */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block">P & K Nutrients</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">
                P: {activeSoilProfile.phosphorusPpm} ppm
              </span>
              <span className="text-xs font-black text-slate-800 block">
                K: {activeSoilProfile.potassiumPpm} ppm
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold mt-1 block">Good Mineral Base</span>
            </div>

            {/* pH & Organic Matter */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold block">pH & Organic Matter</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">
                pH: {activeSoilProfile.ph} (Optimal)
              </span>
              <span className="text-xs font-black text-emerald-800 block">
                SOM: {activeSoilProfile.organicMatterPercent}%
              </span>
              <span className="text-[9px] text-slate-500 font-semibold mt-1 block">
                Moisture: {activeSoilProfile.moisturePercent}%
              </span>
            </div>
          </div>

          {/* Biological Health & Compaction Diagnosis */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-extrabold text-slate-800 block">Soil Biological Health Score</span>
                <span className="text-[11px] text-slate-500">
                  Compaction Risk: <strong>{activeSoilProfile.compactionRisk}</strong>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-black text-sm text-emerald-800">
                {activeSoilProfile.biologicalHealthScore}%
              </span>
              <span className="text-[9px] text-slate-400 block">Microbial Activity</span>
            </div>
          </div>
        </div>

        {/* Card 2: Previous Harvest History & Depletion Analysis */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-amber-100 text-amber-900 rounded-xl">
                <Wheat className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 text-xs sm:text-sm">
                  Previous Harvest History & Soil Impact
                </h3>
                <span className="text-[10px] text-slate-500">
                  Extracted from seasonal harvest records & farm logs
                </span>
              </div>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {recentHarvestsForPlot.historical.length + recentHarvestsForPlot.liveTasks.length} Logged Records
            </span>
          </div>

          {/* Current / Prior Crop on Record */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Most Recent Crop Grown</span>
                <h4 className="font-black text-slate-900 text-xs sm:text-sm mt-0.5">
                  {activeRecommendation.currentOrPreviousCrop}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Harvested: {activeRecommendation.previousHarvestDate} • Plot: {activeRecommendation.plotName}
                </p>
              </div>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0">
                Heavy Extraction
              </span>
            </div>

            {/* Pathogen & Disease Carryover Alerts */}
            {recentHarvestsForPlot.historical[0]?.pestRisksObserved && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                  Observed Pathogen & Weed Pressures:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentHarvestsForPlot.historical[0].pestRisksObserved.map((pest, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md font-semibold flex items-center space-x-1"
                    >
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                      <span>{pest}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Agronomic Conclusion */}
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Agronomic Diagnosis:</strong> Continuing continuous monoculture on {activeSoilProfile.plotName} will cause severe nutrient exhaustion and insect pest buildup. A targeted legume or root break crop is essential.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Optimal Planting Schedule (The Hero Solution) */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-md border border-emerald-700/60 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-emerald-700/60 pb-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Automated Recommendation
              </span>
              <span className="text-emerald-200 text-xs font-semibold">
                Plot: {activeRecommendation.plotName}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-300">
              Optimal Next Crop: {activeRecommendation.recommendedCrop}
            </h3>
            <p className="text-xs text-emerald-100 flex items-center space-x-2">
              <span>Variety: <strong>{activeRecommendation.recommendedVariety}</strong></span>
              <span>•</span>
              <span>Category: <strong>{activeRecommendation.cropCategory}</strong></span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSchedulePlanting(activeRecommendation)}
              className={`font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition-transform active:scale-95 ${
                scheduledSuccessPlotId === activeRecommendation.plotId
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-400/30'
              }`}
            >
              {scheduledSuccessPlotId === activeRecommendation.plotId ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Scheduled in Task Logs</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>⚡ Schedule in Task Logs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Schedule & Economics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 font-bold block">Optimal Planting Window</span>
            <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
              {activeRecommendation.optimalPlantingWindow}
            </span>
            <span className="text-[10px] text-amber-300 font-semibold block mt-1">
              Target: {activeRecommendation.recommendedPlantingDate}
            </span>
          </div>

          <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 font-bold block">Expected Harvest Window</span>
            <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
              {activeRecommendation.expectedHarvestWindow}
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold block mt-1">
              {activeRecommendation.growthDurationDays} Days Growth Cycle
            </span>
          </div>

          <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 font-bold block">Projected Yield</span>
            <span className="text-sm sm:text-base font-black text-white block mt-0.5">
              {activeRecommendation.projectedYieldQtlHa} Qtl/Ha
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold block mt-1">
              High Quality Grade 1
            </span>
          </div>

          <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 font-bold block">Est. Market Revenue</span>
            <span className="text-sm sm:text-base font-black text-amber-300 block mt-0.5">
              {activeRecommendation.projectedRevenueETB.toLocaleString()} ETB
            </span>
            <span className="text-[10px] text-emerald-200 font-semibold block mt-1">
              Based on local market pricing
            </span>
          </div>
        </div>

        {/* Detailed Agronomic Rationale */}
        <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-700/40 space-y-2 text-xs">
          <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider block">
            Why this rotation sequence was chosen:
          </span>
          <p className="text-emerald-50 leading-relaxed text-xs">
            {activeRecommendation.rotationRationale}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-800/80">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block text-[11px]">Biological Nitrogen Fixation:</strong>
                <span className="text-emerald-100 text-[11px]">
                  Adds +{activeRecommendation.soilBenefits.nitrogenFixationKgHa} kg/ha atmospheric nitrogen to soil root zone.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block text-[11px]">Disease & Pest Disruption:</strong>
                <span className="text-emerald-100 text-[11px]">
                  {activeRecommendation.soilBenefits.pestDiseaseBreak}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Layers className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block text-[11px]">Organic Humus conditioning:</strong>
                <span className="text-emerald-100 text-[11px]">
                  {activeRecommendation.soilBenefits.organicMatterBoost}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Sprout className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block text-[11px]">Subsoil Root Benefit:</strong>
                <span className="text-emerald-100 text-[11px]">
                  {activeRecommendation.soilBenefits.rootStructureBenefit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Season Crop Sequence Visualizer */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-amber-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>4-Season Crop Rotation Sequence Plan</span>
            </span>
            <span className="text-[10px] text-emerald-200">Continuous regeneration cycle</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeRecommendation.fourSeasonCycle.map((item, idx) => {
              const isCurrent = item.status === 'Recommended Next';
              const isCompleted = item.status === 'Completed';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
                      : isCompleted
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-800'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-black opacity-80">
                      Step {idx + 1}: {item.season}
                    </span>
                    {isCurrent && (
                      <span className="bg-slate-950 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded">
                        NEXT
                      </span>
                    )}
                  </div>
                  <h5 className="font-black text-sm truncate">{item.crop}</h5>
                  <p className="text-[10px] opacity-90 truncate">{item.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive "What-If" Crop Rotation Simulator */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-100 text-amber-900 rounded-xl">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                What-If Crop Simulation Tool
              </h4>
              <p className="text-[11px] text-slate-500">
                Want to plant something else? Test how alternative crops affect your soil nitrogen and disease risk.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSimulatorOpen((prev) => !prev)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>{isSimulatorOpen ? 'Hide Simulator' : 'Test Alternative Crop'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSimulatorOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {isSimulatorOpen && (
          <div className="pt-2 border-t border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Choose simulated alternative:</span>
              <div className="flex flex-wrap gap-1.5">
                {SIMULATION_CROPS.map((c) => {
                  const isSelected = simulatedCropName === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSimulatedCropName(c.name)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulation Results Box */}
            {activeSimulatedCrop && simulationAnalysis && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                  simulationAnalysis.isConsecutiveMonoculture
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block">
                      Simulation Result for: {activeSimulatedCrop.name}
                    </span>
                    <h5 className="font-black text-sm mt-0.5">
                      Agronomic Rotation Score: {simulationAnalysis.agronomicScore} / 100
                    </h5>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl ${
                      simulationAnalysis.isConsecutiveMonoculture
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {simulationAnalysis.isConsecutiveMonoculture ? '⚠️ High Agronomic Risk' : '✓ Favorable Rotation'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-current/20">
                    <span className="text-[10px] font-bold block opacity-70">Nitrogen Balance Impact</span>
                    <span className="font-black text-sm block mt-0.5">
                      {activeSimulatedCrop.nitrogenImpactKgHa > 0
                        ? `+${activeSimulatedCrop.nitrogenImpactKgHa} kg/Ha (Regenerates)`
                        : `${activeSimulatedCrop.nitrogenImpactKgHa} kg/Ha (Depletes)`}
                    </span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-current/20">
                    <span className="text-[10px] font-bold block opacity-70">Disease & Pathogen Carryover</span>
                    <span className="font-bold text-xs block mt-0.5 truncate">
                      {simulationAnalysis.diseaseRisk}
                    </span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-current/20">
                    <span className="text-[10px] font-bold block opacity-70">Projected Revenue (ETB)</span>
                    <span className="font-black text-sm block mt-0.5">
                      {activeSimulatedCrop.estRevenueETB.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed pt-1">
                  {simulationAnalysis.isConsecutiveMonoculture ? (
                    <strong>
                      Warning: Planting {activeSimulatedCrop.name} immediately after {activeRecommendation.currentOrPreviousCrop} violates core rotation principles, increasing pest concentration and severely depleting nutrients. Consider the recommended legume instead.
                    </strong>
                  ) : (
                    <span>
                      {activeSimulatedCrop.description} Growth duration is approximately {activeSimulatedCrop.durationDays} days.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Full Rotation Audit Report */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white rounded-t-3xl">
              <div>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Farm Certification & Agronomy Audit
                </span>
                <h3 className="font-black text-base sm:text-lg text-amber-300 mt-1">
                  Seasonal Crop Rotation Schedule Audit
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Farm & Farmer:</span>
                  <span className="text-slate-900 font-extrabold">{farmerName} ({farmLocation})</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Total Managed Plots:</span>
                  <span className="text-emerald-700 font-extrabold">{soilProfiles.length} Field Plots</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Farm Biological Health Score:</span>
                  <span className="text-emerald-700 font-extrabold">{farmSoilHealthAverage} / 100</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Total Biological N-Fixation Goal:</span>
                  <span className="text-emerald-700 font-extrabold">+240 kg/Ha Nitrogen across farm</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-black text-slate-900 block">5-Plot Recommended Rotation Plan:</span>
                <div className="space-y-2">
                  {initialCropRotationRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1"
                    >
                      <div className="flex justify-between font-bold">
                        <span className="text-emerald-800 font-black">{rec.plotName}</span>
                        <span className="text-slate-500 font-semibold">{rec.optimalPlantingWindow}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        <span>Previous: <strong className="text-slate-800">{rec.currentOrPreviousCrop}</strong></span>
                        <span>→</span>
                        <span>Next: <strong className="text-emerald-900 font-black">{rec.recommendedCrop}</strong></span>
                      </div>
                      <p className="text-slate-500 text-[10px]">{rec.rotationRationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-3xl">
              <span className="text-[10px] text-slate-400">Compliant with organic farm certification standards</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `BUTTAA CROP ROTATION AUDIT REPORT\nFarmer: ${farmerName}\nLocation: ${farmLocation}\nAverage Soil Health: ${farmSoilHealthAverage}/100\n\nROTATION PLANS:\n` +
                        initialCropRotationRecommendations
                          .map(
                            (r) =>
                              `• ${r.plotName}: Previous: ${r.currentOrPreviousCrop} -> Recommended: ${r.recommendedCrop} (Window: ${r.optimalPlantingWindow})\n  Benefit: +${r.soilBenefits.nitrogenFixationKgHa} kg/ha N, Revenue: ${r.projectedRevenueETB} ETB`
                          )
                          .join('\n\n')
                    );
                    setToastMessage('✓ Rotation Audit copied to clipboard for audit presentation!');
                    setShowExportModal(false);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-black px-4 py-2 rounded-xl text-xs shadow flex items-center space-x-1.5 transition-transform active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
