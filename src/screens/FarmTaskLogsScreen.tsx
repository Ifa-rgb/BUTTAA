import React, { useState, useMemo, useEffect } from 'react';
import {
  FarmTaskLog,
  FarmActivityType,
  TaskStatus,
  TaskPriority,
  User,
  ScreenId,
  Language
} from '../types';
import { getTranslation } from '../i18n';
import {
  Sprout,
  Droplets,
  Wheat,
  FlaskConical,
  ShieldAlert,
  Scissors,
  Tractor,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Search,
  Filter,
  BarChart3,
  CalendarDays,
  Sparkles,
  Edit3,
  Trash2,
  ChevronRight,
  ArrowLeft,
  X,
  Share2,
  FileText,
  MapPin,
  Check,
  AlertCircle,
  CloudSun,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Bell,
  BellRing,
  Flame,
  AlertTriangle,
  Volume2,
  ArrowUpDown,
  CheckCircle,
  Download,
  FileSpreadsheet,
  Camera,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { FarmTaskProgressChart } from '../components/FarmTaskProgressChart';
import { FarmTaskCalendarView } from '../components/FarmTaskCalendarView';
import { TaskPhotoVerificationModal } from '../components/TaskPhotoVerificationModal';

interface FarmTaskLogsScreenProps {
  logs: FarmTaskLog[];
  currentUser: User;
  onAddLog: (log: Omit<FarmTaskLog, 'id'>) => void;
  onUpdateLog: (log: FarmTaskLog) => void;
  onDeleteLog: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onAddNotification?: (notif: {
    title: string;
    body: string;
    type: 'order' | 'weather' | 'market' | 'alert' | 'general';
  }) => void;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  language: Language;
}

const ACTIVITY_CONFIG: Record<
  FarmActivityType,
  { icon: React.ElementType; color: string; bgColor: string; borderColor: string; label: string }
> = {
  Planting: {
    icon: Sprout,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Planting & Sowing'
  },
  Watering: {
    icon: Droplets,
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    label: 'Irrigation & Watering'
  },
  Harvesting: {
    icon: Wheat,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    label: 'Harvesting'
  },
  Fertilizing: {
    icon: FlaskConical,
    color: 'text-lime-700',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
    label: 'Fertilizing & Nutrients'
  },
  'Pest Control': {
    icon: ShieldAlert,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Pest & Disease Control'
  },
  Pruning: {
    icon: Scissors,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    label: 'Pruning & Training'
  },
  Tilling: {
    icon: Tractor,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Tilling & Land Prep'
  },
  Weeding: {
    icon: Sprout,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Weeding & Cultivation'
  },
  'Soil Treatment': {
    icon: FlaskConical,
    color: 'text-stone-700',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-200',
    label: 'Soil Testing & Compost'
  },
  'General Inspection': {
    icon: CheckCircle2,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    label: 'General Farm Scouting'
  }
};

const COMMON_CROPS = [
  'Arabica Coffee',
  'Pure White Teff',
  'Hybrid Maize',
  'Hass Avocado',
  'Roma Tomatoes',
  'Sweet Pepper',
  'Durum Wheat',
  'Barley',
  'Red Onions'
];

const COMMON_PLOTS = [
  'Block A - High Altitude Terrace',
  'Plot 2 - Valley Flat Field',
  'Ada\'a Loam Plot B',
  'East Orchard Slope',
  'Vegetable Garden Bed #4',
  'Nursery & Raised Beds',
  'South Greenhouse & Polyhouse'
];

export const FarmTaskLogsScreen: React.FC<FarmTaskLogsScreenProps> = ({
  logs,
  currentUser,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
  onToggleStatus,
  onAddNotification,
  onNavigate,
  onBack,
  language
}) => {
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'urgent' | 'newest' | 'oldest' | 'dueToday' | 'priorityAsc'>('urgent');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'summary' | 'analytics'>('timeline');
  const [showProgressSummary, setShowProgressSummary] = useState<boolean>(true);
  const [reminderDismissed, setReminderDismissed] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLog, setEditingLog] = useState<FarmTaskLog | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [photoModalTask, setPhotoModalTask] = useState<FarmTaskLog | null>(null);

  // Form Fields
  const [formActivityType, setFormActivityType] = useState<FarmActivityType>('Planting');
  const [formCrop, setFormCrop] = useState<string>('Arabica Coffee');
  const [formPlotName, setFormPlotName] = useState<string>('Block A - High Altitude Terrace');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState<string>('08:00 AM');
  const [formStatus, setFormStatus] = useState<TaskStatus>('Completed');
  const [formPriority, setFormPriority] = useState<TaskPriority>('Medium');
  const [formDurationHours, setFormDurationHours] = useState<number>(3);
  const [formWorkersCount, setFormWorkersCount] = useState<number>(2);
  const [formQuantityOrMetric, setFormQuantityOrMetric] = useState<string>('');
  const [formCostETB, setFormCostETB] = useState<string>('500');
  const [formWeather, setFormWeather] = useState<string>('Sunny, 22°C');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formOrganic, setFormOrganic] = useState<boolean>(true);
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [formPhotoTimestamp, setFormPhotoTimestamp] = useState<string>('');
  const [formPhotoVerified, setFormPhotoVerified] = useState<boolean>(false);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Compute tasks due today
  const tasksDueToday = useMemo(() => {
    return logs.filter((l) => l.date === todayStr);
  }, [logs, todayStr]);

  const pendingTasksDueToday = useMemo(() => {
    return tasksDueToday.filter((l) => l.status !== 'Completed');
  }, [tasksDueToday]);

  const urgentTasksDueToday = useMemo(() => {
    return pendingTasksDueToday.filter((l) => l.priority === 'High');
  }, [pendingTasksDueToday]);

  // Audio chime for gentle reminder bell
  const playReminderChime = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Note 1: Bell tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Note 2: Harmonizing tone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6
      gain2.gain.setValueAtTime(0.15, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.8);
    } catch {
      // Audio fallback silent
    }
  };

  // Trigger app notification reminder
  const handleTriggerDailyReminder = () => {
    playReminderChime();
    const count = pendingTasksDueToday.length;
    const bodyText =
      count > 0
        ? `Reminder: ${count} task(s) scheduled for today (${urgentTasksDueToday.length} High Priority). Tasks: ${pendingTasksDueToday
            .map((t) => `${t.activityType} in ${t.crop}`)
            .join(', ')}.`
        : 'All farm activities scheduled for today have been completed!';

    if (onAddNotification) {
      onAddNotification({
        title: count > 0 ? `Farm Alert: ${count} Tasks Due Today` : 'Daily Farm Tasks Completed',
        body: bodyText,
        type: 'alert'
      });
    }

    setNotificationToast(
      count > 0
        ? `🔔 Notification sent to your alert tray (${count} task${count > 1 ? 's' : ''} due today)!`
        : '🎉 Sync complete: All scheduled tasks for today are done!'
    );
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Auto-sync notification on mount once per session if pending tasks exist
  useEffect(() => {
    const sessionKey = `buttaa_notif_synced_${todayStr}`;
    if (pendingTasksDueToday.length > 0 && !sessionStorage.getItem(sessionKey)) {
      if (onAddNotification) {
        onAddNotification({
          title: `Daily Farm Alert: ${pendingTasksDueToday.length} Tasks Due Today`,
          body: `You have ${pendingTasksDueToday.length} task(s) scheduled for today (${urgentTasksDueToday.length} Urgent). Review them in Farm Task Logs.`,
          type: 'alert'
        });
        sessionStorage.setItem(sessionKey, 'true');
      }
    }
  }, [todayStr, pendingTasksDueToday.length, urgentTasksDueToday.length, onAddNotification]);

  // Reset form or open for edit
  const openNewModal = () => {
    setEditingLog(null);
    setFormActivityType('Planting');
    setFormCrop('Arabica Coffee');
    setFormPlotName(COMMON_PLOTS[0]);
    setFormDate(todayStr);
    setFormTime('08:00 AM');
    setFormStatus('Completed');
    setFormPriority('Medium');
    setFormDurationHours(3);
    setFormWorkersCount(2);
    setFormQuantityOrMetric('');
    setFormCostETB('');
    setFormWeather('Sunny & Clear, 22°C');
    setFormNotes('');
    setFormOrganic(true);
    setFormPhotoUrl('');
    setFormPhotoTimestamp('');
    setFormPhotoVerified(false);
    setIsModalOpen(true);
  };

  const openNewModalForDate = (dateStr: string) => {
    setEditingLog(null);
    setFormActivityType('Planting');
    setFormCrop('Arabica Coffee');
    setFormPlotName(COMMON_PLOTS[0]);
    setFormDate(dateStr);
    setFormTime('08:00 AM');
    setFormStatus('Scheduled');
    setFormPriority('Medium');
    setFormDurationHours(3);
    setFormWorkersCount(2);
    setFormQuantityOrMetric('');
    setFormCostETB('');
    setFormWeather('Sunny & Clear, 22°C');
    setFormNotes('');
    setFormOrganic(true);
    setFormPhotoUrl('');
    setFormPhotoTimestamp('');
    setFormPhotoVerified(false);
    setIsModalOpen(true);
  };

  const openEditModal = (log: FarmTaskLog) => {
    setEditingLog(log);
    setFormActivityType(log.activityType);
    setFormCrop(log.crop);
    setFormPlotName(log.plotName);
    setFormDate(log.date);
    setFormTime(log.time || '08:00 AM');
    setFormStatus(log.status);
    setFormPriority(log.priority || 'Medium');
    setFormDurationHours(log.durationHours);
    setFormWorkersCount(log.workersCount);
    setFormQuantityOrMetric(log.quantityOrMetric || '');
    setFormCostETB(log.costETB ? String(log.costETB) : '');
    setFormWeather(log.weather || 'Sunny, 22°C');
    setFormNotes(log.notes);
    setFormOrganic(log.isOrganicCertified ?? true);
    setFormPhotoUrl(log.photoUrl || '');
    setFormPhotoTimestamp(log.photoTimestamp || '');
    setFormPhotoVerified(log.photoVerified || false);
    setIsModalOpen(true);
  };

  const handleSaveTaskPhoto = (
    photoUrl: string,
    photoTimestamp: string,
    verificationNote: string,
    markCompleted: boolean
  ) => {
    if (!photoModalTask) return;

    const updatedTask: FarmTaskLog = {
      ...photoModalTask,
      photoUrl,
      photoTimestamp,
      photoVerified: true,
      photoVerificationNote: verificationNote,
      status: markCompleted ? 'Completed' : photoModalTask.status
    };

    onUpdateLog(updatedTask);
    setPhotoModalTask(null);
    setNotificationToast(`✓ Work verified with photo for ${updatedTask.crop}!`);

    if (onAddNotification) {
      onAddNotification({
        title: `Work Verified: ${updatedTask.activityType} on ${updatedTask.crop}`,
        body: `Photo attached for ${updatedTask.plotName}. Proof of work recorded.`,
        type: 'general'
      });
    }
  };

  const handleRemoveTaskPhoto = () => {
    if (!photoModalTask) return;
    const updatedTask: FarmTaskLog = {
      ...photoModalTask,
      photoUrl: undefined,
      photoTimestamp: undefined,
      photoVerified: false,
      photoVerificationNote: undefined
    };
    onUpdateLog(updatedTask);
    setPhotoModalTask(null);
    setNotificationToast('Verification photo removed.');
  };

  const handleApplyPreset = (preset: {
    activity: FarmActivityType;
    crop: string;
    plot: string;
    metric: string;
    notes: string;
    duration: number;
    workers: number;
    priority?: TaskPriority;
  }) => {
    setFormActivityType(preset.activity);
    setFormCrop(preset.crop);
    setFormPlotName(preset.plot);
    setFormQuantityOrMetric(preset.metric);
    setFormNotes(preset.notes);
    setFormDurationHours(preset.duration);
    setFormWorkersCount(preset.workers);
    setFormPriority(preset.priority || 'High');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLog) {
      onUpdateLog({
        ...editingLog,
        activityType: formActivityType,
        crop: formCrop,
        plotName: formPlotName,
        date: formDate,
        time: formTime,
        status: formStatus,
        priority: formPriority,
        durationHours: Number(formDurationHours) || 1,
        workersCount: Number(formWorkersCount) || 1,
        quantityOrMetric: formQuantityOrMetric,
        costETB: formCostETB ? Number(formCostETB) : undefined,
        weather: formWeather,
        notes: formNotes,
        isOrganicCertified: formOrganic,
        photoUrl: formPhotoUrl || undefined,
        photoTimestamp: formPhotoTimestamp || (formPhotoUrl ? new Date().toISOString() : undefined),
        photoVerified: formPhotoVerified || (formPhotoUrl ? true : false)
      });
    } else {
      onAddLog({
        farmerId: currentUser.id,
        activityType: formActivityType,
        crop: formCrop,
        plotName: formPlotName,
        date: formDate,
        time: formTime,
        status: formStatus,
        priority: formPriority,
        durationHours: Number(formDurationHours) || 1,
        workersCount: Number(formWorkersCount) || 1,
        quantityOrMetric: formQuantityOrMetric,
        costETB: formCostETB ? Number(formCostETB) : undefined,
        weather: formWeather,
        notes: formNotes,
        isOrganicCertified: formOrganic,
        photoUrl: formPhotoUrl || undefined,
        photoTimestamp: formPhotoUrl ? new Date().toISOString() : undefined,
        photoVerified: formPhotoUrl ? true : false
      });
    }
    setIsModalOpen(false);
  };

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    const priorityWeights: Record<TaskPriority, number> = {
      High: 3,
      Medium: 2,
      Low: 1
    };

    return logs
      .filter((log) => {
        if (selectedActivityFilter !== 'All' && log.activityType !== selectedActivityFilter) {
          return false;
        }
        if (selectedStatusFilter !== 'All' && log.status !== selectedStatusFilter) {
          return false;
        }
        if (selectedCropFilter !== 'All' && log.crop !== selectedCropFilter) {
          return false;
        }
        if (selectedPriorityFilter !== 'All' && log.priority !== selectedPriorityFilter) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchCrop = log.crop.toLowerCase().includes(q);
          const matchPlot = log.plotName.toLowerCase().includes(q);
          const matchNotes = log.notes.toLowerCase().includes(q);
          const matchAct = log.activityType.toLowerCase().includes(q);
          const matchPriority = (log.priority || '').toLowerCase().includes(q);
          if (!matchCrop && !matchPlot && !matchNotes && !matchAct && !matchPriority) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgent') {
          // Urgent Tasks First:
          // 1. High (300) > Medium (200) > Low (100)
          // 2. Pending or Scheduled tasks receive +50 urgency boost
          // 3. Tasks due today receive +20 boost
          const aPending = a.status !== 'Completed' ? 50 : 0;
          const bPending = b.status !== 'Completed' ? 50 : 0;
          const aToday = a.date === todayStr ? 20 : 0;
          const bToday = b.date === todayStr ? 20 : 0;
          const aPriority = (priorityWeights[a.priority] || 1) * 100;
          const bPriority = (priorityWeights[b.priority] || 1) * 100;

          const totalA = aPriority + aPending + aToday;
          const totalB = bPriority + bPending + bToday;

          if (totalB !== totalA) {
            return totalB - totalA;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        if (sortBy === 'priorityAsc') {
          const diff = (priorityWeights[a.priority] || 1) - (priorityWeights[b.priority] || 1);
          if (diff !== 0) return diff;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        if (sortBy === 'dueToday') {
          const aToday = a.date === todayStr ? 1 : 0;
          const bToday = b.date === todayStr ? 1 : 0;
          if (bToday !== aToday) return bToday - aToday;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }

        // 'newest'
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [
    logs,
    selectedActivityFilter,
    selectedStatusFilter,
    selectedCropFilter,
    selectedPriorityFilter,
    searchQuery,
    sortBy,
    todayStr
  ]);

  // Key performance metrics
  const totalTasks = logs.length;
  const completedTasks = logs.filter((l) => l.status === 'Completed').length;
  const scheduledTasks = logs.filter((l) => l.status === 'Scheduled').length;
  const inProgressTasks = logs.filter((l) => l.status === 'In Progress').length;
  const totalLaborHours = logs.reduce((sum, l) => sum + (l.durationHours || 0), 0);
  const totalCost = logs.reduce((sum, l) => sum + (l.costETB || 0), 0);

  // Activity counts
  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      counts[l.activityType] = (counts[l.activityType] || 0) + 1;
    });
    return counts;
  }, [logs]);

  // Copy report
  const handleCopyReport = () => {
    const reportText = `BUTTAA - FARM TASK LOGS REPORT
Farm: ${currentUser.farmInfo?.farmName || 'Bona Organics Farm'}
Farmer: ${currentUser.name} (${currentUser.location})
Generated Date: ${new Date().toLocaleDateString()}

SUMMARY STATS:
• Total Farm Activities: ${totalTasks}
• Completed Activities: ${completedTasks} (${Math.round((completedTasks / (totalTasks || 1)) * 100)}%)
• Scheduled Ahead: ${scheduledTasks}
• Total Labor Logged: ${totalLaborHours.toFixed(1)} Hours
• Total Operational Cost Tracked: ${totalCost.toLocaleString()} ETB

RECENT LOG DETAILS:
${logs
  .slice(0, 8)
  .map(
    (l, idx) =>
      `${idx + 1}. [${l.date}] ${l.activityType.toUpperCase()} - ${l.crop} (${l.plotName})\n   Status: ${l.status} | Duration: ${l.durationHours}h | Output: ${l.quantityOrMetric || 'N/A'}\n   Notes: ${l.notes}`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Export task history as CSV for farm record keeping
  const handleExportCSV = (onlyFiltered: boolean = false) => {
    const dataToExport = onlyFiltered ? filteredLogs : logs;
    if (dataToExport.length === 0) {
      setNotificationToast('No farm tasks found to export.');
      return;
    }

    const headers = [
      'Task ID',
      'Date',
      'Time',
      'Activity Type',
      'Crop',
      'Plot / Field Name',
      'Status',
      'Priority',
      'Duration (Hours)',
      'Laborers Count',
      'Quantity or Output Metric',
      'Operating Cost (ETB)',
      'Weather Condition',
      'Organic Certified',
      'Photo Verified',
      'Photo Timestamp',
      'Farmer ID',
      'Field Observations & Notes'
    ];

    const escapeCSV = (val: string | number | boolean | undefined | null): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = dataToExport.map((log) => [
      escapeCSV(log.id),
      escapeCSV(log.date),
      escapeCSV(log.time || 'N/A'),
      escapeCSV(log.activityType),
      escapeCSV(log.crop),
      escapeCSV(log.plotName),
      escapeCSV(log.status),
      escapeCSV(log.priority || 'Medium'),
      escapeCSV(log.durationHours),
      escapeCSV(log.workersCount),
      escapeCSV(log.quantityOrMetric || 'N/A'),
      escapeCSV(log.costETB ?? '0'),
      escapeCSV(log.weather || 'N/A'),
      escapeCSV(log.isOrganicCertified ? 'Yes (Organic)' : 'No'),
      escapeCSV(log.photoVerified || log.photoUrl ? 'Yes (Photo Attached)' : 'No Photo'),
      escapeCSV(log.photoTimestamp ? new Date(log.photoTimestamp).toLocaleString() : 'N/A'),
      escapeCSV(log.farmerId),
      escapeCSV(log.notes || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    const fileSuffix = onlyFiltered ? 'filtered_' : 'full_history_';
    link.href = url;
    link.setAttribute('download', `buttaa_farm_task_logs_${fileSuffix}${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotificationToast(
      `Exported ${dataToExport.length} task log(s) to CSV spreadsheet!`
    );
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-[90vh]">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onBack || (() => onNavigate('farmer-dashboard'))}
                  className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition-colors"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  Farm Activity Tracking
                </span>
                <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  100% Organic Verified
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-amber-300 mt-2 tracking-tight">
                Farm Task Logs & Progress
              </h1>
              <p className="text-xs text-emerald-100 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {currentUser.farmInfo?.farmName || 'Bona Organics Farm'} • {currentUser.location} •{' '}
                  {currentUser.farmInfo?.sizeHectares || 4.5} Hectares
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {pendingTasksDueToday.length > 0 && (
                <button
                  onClick={() => {
                    setReminderDismissed(false);
                    playReminderChime();
                  }}
                  className="bg-rose-500/90 hover:bg-rose-500 text-white font-extrabold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm border border-rose-400 transition-transform active:scale-95 animate-pulse"
                  title="View Tasks Due Today"
                >
                  <BellRing className="w-4 h-4 text-amber-200" />
                  <span className="hidden sm:inline">{pendingTasksDueToday.length} Due Today</span>
                  <span className="sm:hidden">{pendingTasksDueToday.length} Due</span>
                </button>
              )}

              <button
                onClick={() => setViewMode((prev) => (prev === 'calendar' ? 'timeline' : 'calendar'))}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border shadow-sm transition-transform active:scale-95 ${
                  viewMode === 'calendar'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border-emerald-700'
                }`}
                title="Switch between Timeline and Calendar view"
              >
                <CalendarDays className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">
                  {viewMode === 'calendar' ? 'Timeline View' : 'Calendar View'}
                </span>
                <span className="sm:hidden">Calendar</span>
              </button>

              <button
                onClick={() => handleExportCSV(false)}
                className="bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-emerald-700 shadow-sm transition-transform active:scale-95"
                title="Export complete farm task history as CSV spreadsheet"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-emerald-700 shadow-sm transition-transform active:scale-95"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Report</span>
              </button>

              <button
                onClick={openNewModal}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-transform active:scale-95 ring-2 ring-amber-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Log Daily Activity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-400/60 text-xs font-bold flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-4">
          <BellRing className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span>{notificationToast}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-3 sm:p-5 space-y-5">
        {/* Notification Feature: Tasks Due Today Reminder Banner / Card */}
        {!reminderDismissed ? (
          <div className="bg-gradient-to-r from-amber-50 via-rose-50/40 to-emerald-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 relative transition-all">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h2 className="font-black text-slate-900 text-sm sm:text-base">
                      Daily Task Reminders (Due Today,{' '}
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                    </h2>
                    {pendingTasksDueToday.length > 0 ? (
                      <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        {pendingTasksDueToday.length} Pending
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        All Completed!
                      </span>
                    )}
                    {urgentTasksDueToday.length > 0 && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-rose-600" />
                        <span>{urgentTasksDueToday.length} Urgent</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {pendingTasksDueToday.length > 0
                      ? `You have ${pendingTasksDueToday.length} farm task(s) scheduled for today. Complete them on time to protect crops and maintain farm productivity.`
                      : 'Great job! All scheduled activities for today are completed. Check upcoming tasks or log extra routine work.'}
                  </p>
                </div>
              </div>

              {/* Action Controls for Reminder */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTriggerDailyReminder}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
                  title="Send notification reminder to top app alert tray"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Push Alert</span>
                </button>

                <button
                  onClick={playReminderChime}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold p-1.5 rounded-xl text-xs transition-colors"
                  title="Test reminder audio chime"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                </button>

                <button
                  onClick={() => setReminderDismissed(true)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Minimize reminder card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of Tasks Due Today */}
            {tasksDueToday.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {tasksDueToday.map((task) => {
                  const isDone = task.status === 'Completed';
                  const isHigh = task.priority === 'High';
                  const conf = ACTIVITY_CONFIG[task.activityType] || ACTIVITY_CONFIG['General Inspection'];
                  const Icon = conf.icon;

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all shadow-xs ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 opacity-85'
                          : isHigh
                          ? 'bg-white border-rose-300 ring-2 ring-rose-200'
                          : 'bg-white border-amber-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isHigh
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-black text-slate-900 text-xs truncate">
                              {task.activityType}: {task.crop}
                            </span>
                            {isHigh && (
                              <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-1.5 py-0.2 rounded border border-rose-300 shrink-0 flex items-center space-x-0.5">
                                <Flame className="w-2.5 h-2.5 text-rose-600" />
                                <span>URGENT</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {task.plotName} • {task.time || 'All Day'} • {task.durationHours}h
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => onToggleStatus(task.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                            isDone
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          }`}
                          title="Toggle completion status"
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </>
                          ) : (
                            <span>Mark Done</span>
                          )}
                        </button>
                        <button
                          onClick={() => setPhotoModalTask(task)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            task.photoUrl
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                          }`}
                          title={task.photoUrl ? 'View verified photo' : 'Capture photo verification'}
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-2.5 text-xs text-slate-500 bg-white/70 rounded-xl border border-amber-200/50">
                No tasks scheduled for today. Click <strong>Log Daily Activity</strong> above to create a task for today.
              </div>
            )}
          </div>
        ) : (
          /* Minimized Reminder Pill */
          tasksDueToday.length > 0 && (
            <div className="bg-amber-100/80 border border-amber-300 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-700 animate-bounce" />
                <span className="font-extrabold text-amber-950">
                  Daily Task Reminder:{' '}
                  <span className="font-black text-rose-700">
                    {pendingTasksDueToday.length} task(s) due today
                  </span>{' '}
                  ({urgentTasksDueToday.length} Urgent)
                </span>
              </div>
              <button
                onClick={() => setReminderDismissed(false)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[11px] shadow-xs transition-colors"
              >
                Expand Reminders
              </button>
            </div>
          )
        )}
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Activities
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <CalendarDays className="w-4 h-4" />
                </span>
              </div>
              <span className="text-2xl font-black text-slate-900 block mt-1">{totalTasks}</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{completedTasks} completed • {scheduledTasks} upcoming</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Labor Time
                </span>
                <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <span className="text-2xl font-black text-sky-800 block mt-1">
                {totalLaborHours.toFixed(1)}{' '}
                <span className="text-xs font-semibold text-slate-500">Hours</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-2">
              Across all farm field operations
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Harvest Yields
                </span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <Wheat className="w-4 h-4" />
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-amber-700 block mt-1 truncate">
                14.5 Qtl Coffee
              </span>
            </div>
            <span className="text-[10px] text-amber-800 font-semibold block mt-2">
              Next: Pepper & Maize harvest
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Operating Cost
                </span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <span className="text-lg sm:text-xl font-black text-purple-900 block mt-1">
                {totalCost.toLocaleString()}{' '}
                <span className="text-xs font-semibold text-slate-500">ETB</span>
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-2">
              Labor, bio-spray & seeds
            </span>
          </div>
        </div>

        {/* AI Agronomist Smart Insight Box */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl shadow-sm border border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full">
                  AI Agro-Advisor
                </span>
                <span className="text-[11px] text-emerald-200">Based on your recent logged tasks</span>
              </div>
              <p className="text-xs text-white mt-1 leading-relaxed">
                <strong className="text-amber-300">Coffee Plot A & Maize Plot:</strong> Irrigation was
                completed 2 days ago with good soil moisture retention. Given regional warm forecasts,
                scout the White Teff plot for seed germination before scheduling the next secondary furrow
                watering.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl shadow transition-transform active:scale-95"
          >
            Ask AI Agronomist
          </button>
        </div>

        {/* 1-Tap Quick Log Presets bar */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Tap Routine Log Presets (Fast Entry)</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to autofill new activity</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => {
                openNewModal();
                handleApplyPreset({
                  activity: 'Watering',
                  crop: 'Arabica Coffee',
                  plot: 'Block A - High Altitude Terrace',
                  metric: '4,000 Liters (Drip)',
                  notes: 'Morning drip cycle run across main coffee terraces. Moisture probe at 20cm.',
                  duration: 2.5,
                  workers: 1
                });
              }}
              className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1 transition-colors"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>💧 Morning Coffee Drip (2.5h)</span>
            </button>

            <button
              onClick={() => {
                openNewModal();
                handleApplyPreset({
                  activity: 'Harvesting',
                  crop: 'Arabica Coffee',
                  plot: 'Block A - High Altitude Terrace',
                  metric: '10 Quintals Cherries',
                  notes: 'Hand-picked ripe red cherries spread on raised sun-drying tables.',
                  duration: 6.0,
                  workers: 6
                });
              }}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1 transition-colors"
            >
              <Wheat className="w-3.5 h-3.5 text-amber-600" />
              <span>🌾 Coffee Hand-Harvest (10 Qtl)</span>
            </button>

            <button
              onClick={() => {
                openNewModal();
                handleApplyPreset({
                  activity: 'Planting',
                  crop: 'Pure White Teff',
                  plot: 'Ada\'a Loam Plot B',
                  metric: '1.5 Hectares Seeded',
                  notes: 'Broadcast certified white teff seeds on damp pre-rolled soil bed.',
                  duration: 4.0,
                  workers: 3
                });
              }}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1 transition-colors"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>🌱 White Teff Sowing (1.5 Ha)</span>
            </button>

            <button
              onClick={() => {
                openNewModal();
                handleApplyPreset({
                  activity: 'Fertilizing',
                  crop: 'Hass Avocado',
                  plot: 'East Orchard Slope',
                  metric: '300 kg Organic Compost',
                  notes: 'Ring application of organic manure compost at root canopy line.',
                  duration: 3.0,
                  workers: 2
                });
              }}
              className="bg-lime-50 hover:bg-lime-100 text-lime-800 border border-lime-200 px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5 text-lime-600" />
              <span>🧪 Compost Dressing (300kg)</span>
            </button>

            <button
              onClick={() => {
                openNewModal();
                handleApplyPreset({
                  activity: 'Pest Control',
                  crop: 'Roma Tomatoes',
                  plot: 'Vegetable Garden Bed #4',
                  metric: '25L Organic Neem Spray',
                  notes: 'Preventive organic botanical spray for leaf blight and mites.',
                  duration: 2.0,
                  workers: 1
                });
              }}
              className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              <span>🛡️ Organic Neem Spray (25L)</span>
            </button>
          </div>
        </div>

        {/* Progress Summary Section using D3 Bar Chart (Visualizes Completed vs Pending Tasks over last 7 days) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-lg bg-emerald-800 text-amber-300">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                Progress Summary (Last 7 Days)
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                D3 Visualization
              </span>
            </div>

            <button
              onClick={() => setShowProgressSummary((prev) => !prev)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 p-1 transition-colors"
            >
              <span>{showProgressSummary ? 'Collapse Chart' : 'Expand 7-Day Chart'}</span>
              {showProgressSummary ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {showProgressSummary && <FarmTaskProgressChart logs={logs} />}
        </section>

        {/* View Toggle & Search/Filter Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* View Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shrink-0 ${
                  viewMode === 'timeline'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Activity Timeline ({filteredLogs.length})</span>
              </button>

              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shrink-0 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-emerald-700" />
                <span>Calendar View</span>
              </button>

              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shrink-0 ${
                  viewMode === 'summary'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Progress Summary</span>
              </button>

              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shrink-0 ${
                  viewMode === 'analytics'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Crop Analytics</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search crop, plot, activity, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Activity Category Pill Filters */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>Type:</span>
              </span>

              {['All', 'Planting', 'Watering', 'Harvesting', 'Fertilizing', 'Pest Control', 'Pruning', 'Tilling'].map(
                (act) => {
                  const isSelected = selectedActivityFilter === act;
                  return (
                    <button
                      key={act}
                      onClick={() => setSelectedActivityFilter(act)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {act === 'All' ? 'All Activities' : act}
                    </button>
                  );
                }
              )}
            </div>

            {/* Sub-Filters: Status, Crop, Priority & Sorting */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              {/* Quick 1-Click Urgent Sort Button */}
              <button
                onClick={() => setSortBy((prev) => (prev === 'urgent' ? 'newest' : 'urgent'))}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs ${
                  sortBy === 'urgent'
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                }`}
                title="Sort urgent and high-priority tasks to the top"
              >
                <Flame className={`w-3.5 h-3.5 ${sortBy === 'urgent' ? 'text-amber-200' : 'text-rose-600'}`} />
                <span>{sortBy === 'urgent' ? '⚡ Urgent First (Active)' : '⚡ Sort Urgent First'}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="urgent">⚡ Urgent Tasks First</option>
                  <option value="newest">📅 Newest Date First</option>
                  <option value="oldest">📅 Oldest Date First</option>
                  <option value="dueToday">⏰ Due Today First</option>
                  <option value="priorityAsc">🟢 Low Priority First</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-slate-400">Priority:</span>
                <select
                  value={selectedPriorityFilter}
                  onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">🔴 High (Urgent)</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <span className="text-[10px] font-bold text-slate-400">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed ({completedTasks})</option>
                  <option value="In Progress">In Progress ({inProgressTasks})</option>
                  <option value="Scheduled">Scheduled ({scheduledTasks})</option>
                </select>
              </div>

              {/* Crop Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                <span className="text-[10px] font-bold text-slate-400">Crop:</span>
                <select
                  value={selectedCropFilter}
                  onChange={(e) => setSelectedCropFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Crops</option>
                  {COMMON_CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedActivityFilter !== 'All' ||
                selectedStatusFilter !== 'All' ||
                selectedCropFilter !== 'All' ||
                selectedPriorityFilter !== 'All' ||
                sortBy !== 'urgent' ||
                searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedActivityFilter('All');
                    setSelectedStatusFilter('All');
                    setSelectedCropFilter('All');
                    setSelectedPriorityFilter('All');
                    setSortBy('urgent');
                    setSearchQuery('');
                  }}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline px-1"
                >
                  Reset Filters
                </button>
              )}

              <div className="ml-auto flex items-center space-x-1.5">
                <button
                  onClick={() => handleExportCSV(true)}
                  className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                  title="Download current filtered tasks as CSV file"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Export CSV ({filteredLogs.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode 1: TIMELINE VIEW */}
        {viewMode === 'timeline' && (
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3 shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-800 text-base">No Farm Tasks Match Filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing active filters or click the button below to log a new farm activity.
                </p>
                <button
                  onClick={openNewModal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Task</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  const conf = ACTIVITY_CONFIG[log.activityType] || ACTIVITY_CONFIG['General Inspection'];
                  const Icon = conf.icon;
                  const isDone = log.status === 'Completed';
                  const isScheduled = log.status === 'Scheduled';
                  const isHighPriority = log.priority === 'High';

                  return (
                    <div
                      key={log.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md p-4 sm:p-5 relative ${
                        isHighPriority && !isDone
                          ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/15'
                          : isScheduled
                          ? 'border-amber-200 bg-amber-50/20'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        {/* Left: Icon & Main Titles */}
                        <div className="flex items-start space-x-3.5">
                          <div
                            className={`w-11 h-11 rounded-2xl ${conf.bgColor} ${conf.borderColor} border flex items-center justify-center shrink-0 ${conf.color} shadow-xs`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${conf.bgColor} ${conf.color} border ${conf.borderColor}`}
                              >
                                {log.activityType}
                              </span>

                              <span className="text-xs font-black text-slate-900">{log.crop}</span>

                              {/* Priority Badge */}
                              {log.priority === 'High' ? (
                                <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-2xs">
                                  <Flame className="w-3 h-3 text-rose-600" />
                                  <span>HIGH PRIORITY</span>
                                </span>
                              ) : log.priority === 'Medium' ? (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>MEDIUM</span>
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3 text-slate-500" />
                                  <span>LOW</span>
                                </span>
                              )}

                              {log.isOrganicCertified && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Organic
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold mt-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-slate-700">{log.plotName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Date, Status Toggle & Actions */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end sm:self-auto">
                          {/* Date & Time */}
                          <div className="text-right text-[11px] text-slate-500">
                            <span className="font-extrabold text-slate-800 block">
                              {new Date(log.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            {log.time && <span className="text-[10px] text-slate-400">{log.time}</span>}
                          </div>

                          {/* Status toggle button */}
                          <button
                            onClick={() => onToggleStatus(log.id)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : isScheduled
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 ring-1 ring-amber-300'
                                : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {isDone ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Completed</span>
                              </>
                            ) : isScheduled ? (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                <span>Scheduled</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-sky-700" />
                                <span>In Progress</span>
                              </>
                            )}
                          </button>

                          {/* Quick Edit/Delete */}
                          <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
                            <button
                              onClick={() => openEditModal(log)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Activity"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteLog(log.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Metrics details pills */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                        {log.quantityOrMetric && (
                          <div className="bg-slate-100 text-slate-800 font-extrabold px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                            <span className="text-slate-400 text-[10px]">Output/Metric:</span>
                            <span className="text-emerald-800">{log.quantityOrMetric}</span>
                          </div>
                        )}

                        <div className="bg-slate-50 text-slate-700 font-semibold px-2 py-1 rounded-lg flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.durationHours} hrs duration</span>
                        </div>

                        <div className="bg-slate-50 text-slate-700 font-semibold px-2 py-1 rounded-lg flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.workersCount} laborers</span>
                        </div>

                        {log.costETB && (
                          <div className="bg-slate-50 text-slate-700 font-semibold px-2 py-1 rounded-lg flex items-center space-x-1">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                            <span>{log.costETB.toLocaleString()} ETB</span>
                          </div>
                        )}

                        {log.weather && (
                          <div className="bg-slate-50 text-slate-600 text-[11px] px-2 py-1 rounded-lg flex items-center space-x-1">
                            <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                            <span>{log.weather}</span>
                          </div>
                        )}
                      </div>

                      {/* Observations / Notes */}
                      {log.notes && (
                        <div className="mt-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900 mr-1.5">Field Observation:</span>
                          {log.notes}
                        </div>
                      )}

                      {/* Photo Verification Proof Section */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                        {log.photoUrl ? (
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setPhotoModalTask(log)}
                              className="relative group rounded-xl overflow-hidden border border-emerald-300 w-14 h-14 shrink-0 shadow-xs cursor-pointer focus:outline-none"
                              title="Click to view full verification photo or retake"
                            >
                              <img
                                src={log.photoUrl}
                                alt="Task verification photo"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 flex items-center justify-center transition-colors">
                                <Camera className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            </button>

                            <div>
                              <div className="flex items-center space-x-1.5 flex-wrap">
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center space-x-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                  <span>WORK VERIFIED WITH PHOTO</span>
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {log.photoVerificationNote || 'Audit proof captured via device camera.'}
                              </p>
                              {log.photoTimestamp && (
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  Stamped: {new Date(log.photoTimestamp).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setPhotoModalTask(log)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-2xs"
                              title="Capture or attach photo proof of completed work"
                            >
                              <Camera className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Capture Photo Verification</span>
                            </button>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">
                              No photo attached yet • Tap camera to verify field work
                            </span>
                          </div>
                        )}

                        {log.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setPhotoModalTask(log)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 p-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View / Retake Photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View Mode: CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <FarmTaskCalendarView
            logs={logs}
            onToggleStatus={onToggleStatus}
            onEditLog={openEditModal}
            onDeleteLog={onDeleteLog}
            onAddNewForDate={openNewModalForDate}
            onVerifyPhoto={(task) => setPhotoModalTask(task)}
          />
        )}

        {/* View Mode 2: DEDICATED PROGRESS SUMMARY VIEW */}
        {viewMode === 'summary' && (
          <div className="space-y-4">
            <FarmTaskProgressChart logs={logs} />

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    7-Day Productivity Insights & Action Items
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operational efficiency and task completion trends for your farm.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-xl">
                  {completedTasks} of {totalTasks} Tasks Completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1">
                    🌱 Harvesting & Yield Velocity
                  </span>
                  <p className="text-emerald-800">
                    High volume harvested during peak sun conditions. 14.5 Quintals of specialty Arabica cherries safely delivered to drying beds.
                  </p>
                </div>

                <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200">
                  <span className="font-bold text-sky-900 block mb-1">
                    💧 Irrigation Regularity
                  </span>
                  <p className="text-sky-800">
                    Consistent drip cycles logged on schedule. Soil infiltration tested at 25cm. Furrow cycle scheduled next for tomatoes.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">
                    ⏳ Upcoming Scheduled Tasks
                  </span>
                  <p className="text-amber-800">
                    {scheduledTasks} activities scheduled ahead (morning nursery furrow watering and sweet pepper cooperative harvesting).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: PROGRESS ANALYTICS VIEW */}
        {viewMode === 'analytics' && (
          <div className="space-y-4">
            {/* Progress Breakdown Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-black text-slate-900 text-base flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                <span>Farm Activity Distribution & Rhythm</span>
              </h3>

              <div className="space-y-3">
                {Object.entries(activityCounts).map(([type, count]) => {
                  const conf = ACTIVITY_CONFIG[type as FarmActivityType] || ACTIVITY_CONFIG['General Inspection'];
                  const pct = Math.round((Number(count) / (totalTasks || 1)) * 100);

                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                          <span className={conf.color}>{conf.label}</span>
                        </span>
                        <span className="font-extrabold text-slate-600">
                          {count} logs ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Crop Season Status Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-black text-slate-900 text-base">Crop Progress Over Time</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-emerald-900 text-sm">Arabica Coffee</span>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                      Harvest & Drying
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Active selective hand-harvesting in high-altitude Block A. 14.5 quintals on sun-drying
                    tables. Pruning completed in canopy grove.
                  </p>
                  <div className="text-[11px] font-bold text-emerald-900 pt-1 border-t border-emerald-200/60 flex justify-between">
                    <span>Logs Tracked: 3</span>
                    <span>Total Labor: 17.5h</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-900 text-sm">Pure White Teff</span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                      Vegetative / Seedling
                    </span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Sowing completed on Ada\'a Loam Plot B (2.2 Hectares). Soil compaction good, waiting for
                    first weed cultivation.
                  </p>
                  <div className="text-[11px] font-bold text-amber-900 pt-1 border-t border-amber-200/60 flex justify-between">
                    <span>Logs Tracked: 1</span>
                    <span>Total Labor: 5.0h</span>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sky-900 text-sm">Hybrid Maize (BH-661)</span>
                    <span className="text-[10px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">
                      Irrigation & Growth
                    </span>
                  </div>
                  <p className="text-xs text-sky-800">
                    Drip irrigation cycle finished with 8,200L deep infiltration across flat field.
                    Excellent tassel development expected soon.
                  </p>
                  <div className="text-[11px] font-bold text-sky-900 pt-1 border-t border-sky-200/60 flex justify-between">
                    <span>Logs Tracked: 1</span>
                    <span>Total Labor: 3.0h</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-purple-900 text-sm">Tomatoes & Peppers</span>
                    <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                      Flowering & Pest Shield
                    </span>
                  </div>
                  <p className="text-xs text-purple-800">
                    Botanical organic neem extract applied. Upcoming scheduled morning furrow irrigation
                    and cooperative harvest on Oct 8.
                  </p>
                  <div className="text-[11px] font-bold text-purple-900 pt-1 border-t border-purple-200/60 flex justify-between">
                    <span>Logs Tracked: 3</span>
                    <span>Total Labor: 7.5h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Log or Edit Activity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white rounded-t-3xl">
              <div>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  {editingLog ? 'Update Activity Log' : 'New Daily Task Entry'}
                </span>
                <h3 className="font-black text-base sm:text-lg text-amber-300 mt-1">
                  {editingLog ? 'Edit Farm Task Record' : 'Log Daily Farm Activity'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Activity Type Picker */}
              <div>
                <label className="font-black text-slate-800 block mb-1.5">
                  1. Activity Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Planting',
                      'Watering',
                      'Harvesting',
                      'Fertilizing',
                      'Pest Control',
                      'Pruning',
                      'Tilling',
                      'Weeding',
                      'Soil Treatment'
                    ] as FarmActivityType[]
                  ).map((type) => {
                    const conf = ACTIVITY_CONFIG[type];
                    const Icon = conf.icon;
                    const isSelected = formActivityType === type;
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormActivityType(type)}
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : conf.color}`} />
                        <span className="truncate">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Crop & Plot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    2. Crop Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {COMMON_CROPS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Vegetable Nursery">Vegetable Nursery</option>
                    <option value="Other Produce">Other Produce</option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    3. Farm Plot / Field Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formPlotName}
                    onChange={(e) => setFormPlotName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {COMMON_PLOTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="Home Farm Field">Home Farm Field</option>
                  </select>
                </div>
              </div>

              {/* Date, Time & Status */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-black text-slate-800 block mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">Time</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 08:30 AM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              {/* Priority Level */}
              <div>
                <label className="font-black text-slate-800 block mb-1.5 flex items-center justify-between">
                  <span>
                    Priority Level <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Controls sorting hierarchy</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormPriority('High')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 font-black text-xs transition-all ${
                      formPriority === 'High'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-300'
                        : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${formPriority === 'High' ? 'text-amber-200' : 'text-rose-600'}`} />
                    <span>High (Urgent)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriority('Medium')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 font-black text-xs transition-all ${
                      formPriority === 'Medium'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-300'
                        : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Medium</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriority('Low')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 font-black text-xs transition-all ${
                      formPriority === 'Low'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Low</span>
                  </button>
                </div>
              </div>

              {/* Quantities & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 block mb-1">
                    Output Metric / Quantity
                  </label>
                  <input
                    type="text"
                    value={formQuantityOrMetric}
                    onChange={(e) => setFormQuantityOrMetric(e.target.value)}
                    placeholder="e.g. 10 Quintals, 5,000 L, 2 Ha"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">Weather at Time</label>
                  <input
                    type="text"
                    value={formWeather}
                    onChange={(e) => setFormWeather(e.target.value)}
                    placeholder="e.g. Sunny, 22°C"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Labor Duration, Workers Count & Operating Cost */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-black text-slate-800 block mb-1">Duration (Hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formDurationHours}
                    onChange={(e) => setFormDurationHours(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">Workers</label>
                  <input
                    type="number"
                    min="1"
                    value={formWorkersCount}
                    onChange={(e) => setFormWorkersCount(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">Cost (ETB)</label>
                  <input
                    type="number"
                    value={formCostETB}
                    onChange={(e) => setFormCostETB(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes & Observations */}
              <div>
                <label className="font-black text-slate-800 block mb-1">
                  Daily Notes & Field Observations
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Record observations: soil moisture, pest scouting, seedling vigour, compost ratio, equipment used..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                ></textarea>
              </div>

              {/* Organic Certified Toggle */}
              <div className="flex items-center space-x-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={formOrganic}
                  onChange={(e) => setFormOrganic(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="organicCheck" className="text-xs font-bold text-emerald-900 cursor-pointer">
                  Compliant with 100% Organic Farming Standards (No synthetic chemicals)
                </label>
              </div>

              {/* Photo Verification Proof Field */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-800 text-xs flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>Photo Proof of Completed Work</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Optional Device Camera Proof</span>
                </div>

                {formPhotoUrl ? (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={formPhotoUrl}
                        alt="Captured task proof"
                        className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2 py-0.5 rounded flex items-center space-x-1 w-max">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>Photo Attached</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1 truncate">
                          Will be saved as verified work evidence for this task.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormPhotoUrl('');
                        setFormPhotoTimestamp('');
                        setFormPhotoVerified(false);
                      }}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoModalTask({
                          id: editingLog ? editingLog.id : 'new-draft-task',
                          farmerId: currentUser.id,
                          activityType: formActivityType,
                          crop: formCrop,
                          plotName: formPlotName,
                          date: formDate,
                          status: formStatus,
                          priority: formPriority,
                          durationHours: formDurationHours,
                          workersCount: formWorkersCount,
                          notes: formNotes
                        });
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-2xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Capture / Attach Photo</span>
                    </button>
                    <span className="text-[11px] text-slate-500">
                      Take field snapshot with device camera for audit verification
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-transform active:scale-95 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLog ? 'Save Changes' : 'Log Activity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Report / Export Summary */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white rounded-t-3xl">
              <div>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Farm Audit & History
                </span>
                <h3 className="font-black text-base sm:text-lg text-amber-300 mt-1">
                  Seasonal Farm Activity Report
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Farm:</span>
                  <span className="text-slate-900 font-extrabold">{currentUser.farmInfo?.farmName}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Farmer:</span>
                  <span className="text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Total Tasks Logged:</span>
                  <span className="text-emerald-700 font-extrabold">{totalTasks}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Completed Tasks:</span>
                  <span className="text-emerald-700 font-extrabold">
                    {completedTasks} ({Math.round((completedTasks / (totalTasks || 1)) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Total Labor Hours:</span>
                  <span className="text-slate-900 font-extrabold">{totalLaborHours.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Operating Cost Tracked:</span>
                  <span className="text-purple-700 font-extrabold">{totalCost.toLocaleString()} ETB</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-black text-slate-900 block">Recent Activity Records:</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {logs.slice(0, 5).map((l) => (
                    <div
                      key={l.id}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-0.5"
                    >
                      <div className="flex justify-between font-bold">
                        <span className="text-emerald-800">{l.activityType} • {l.crop}</span>
                        <span className="text-slate-500">{l.date}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-1">{l.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farm Record Keeping CSV Export Card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-emerald-700 text-white rounded-xl shadow-xs shrink-0">
                      <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">
                        Farm Record Keeping CSV Spreadsheet Export
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Export formatted CSV file with plot locations, crop activities, labor hours, yields, and operating costs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => handleExportCSV(false)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All Tasks CSV ({logs.length})</span>
                  </button>
                  {filteredLogs.length !== logs.length && (
                    <button
                      onClick={() => handleExportCSV(true)}
                      className="bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-2 rounded-xl text-xs shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Download Filtered CSV ({filteredLogs.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {copiedNotification && (
                <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl font-bold text-center text-xs flex items-center justify-center space-x-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Report copied to clipboard successfully!</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50 rounded-b-3xl">
              <span className="text-[10px] text-slate-400">Ready for cooperative or bank audit</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleExportCSV(false)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-black px-3.5 py-2 rounded-xl text-xs shadow flex items-center space-x-1.5 transition-transform active:scale-95"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleCopyReport}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow flex items-center space-x-1.5 transition-transform active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Photo Verification Modal */}
      {photoModalTask && (
        <TaskPhotoVerificationModal
          task={photoModalTask}
          isOpen={true}
          onClose={() => setPhotoModalTask(null)}
          onSavePhoto={(url, timestamp, note, markCompleted) => {
            if (photoModalTask.id === 'new-draft-task') {
              setFormPhotoUrl(url);
              setFormPhotoTimestamp(timestamp);
              setFormPhotoVerified(true);
              setPhotoModalTask(null);
              setNotificationToast('Photo attached to current activity form!');
            } else {
              handleSaveTaskPhoto(url, timestamp, note, markCompleted);
            }
          }}
          onRemovePhoto={() => {
            if (photoModalTask.id === 'new-draft-task') {
              setFormPhotoUrl('');
              setFormPhotoTimestamp('');
              setFormPhotoVerified(false);
              setPhotoModalTask(null);
            } else {
              handleRemoveTaskPhoto();
            }
          }}
        />
      )}
    </div>
  );
};
