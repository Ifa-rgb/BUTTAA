import React, { useState, useMemo } from 'react';
import {
  FarmTaskLog,
  FarmActivityType,
  TaskStatus,
  TaskPriority
} from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Check,
  CheckCircle2,
  Plus,
  Edit3,
  Trash2,
  Flame,
  Droplets,
  Sprout,
  Wheat,
  FlaskConical,
  ShieldAlert,
  Scissors,
  Tractor,
  Sparkles,
  Users,
  DollarSign,
  CloudSun,
  Camera,
  ShieldCheck
} from 'lucide-react';

interface FarmTaskCalendarViewProps {
  logs: FarmTaskLog[];
  onToggleStatus: (id: string) => void;
  onEditLog: (log: FarmTaskLog) => void;
  onDeleteLog: (id: string) => void;
  onAddNewForDate: (dateStr: string) => void;
  onVerifyPhoto?: (task: FarmTaskLog) => void;
}

const ACTIVITY_ICONS: Record<FarmActivityType, React.ElementType> = {
  Planting: Sprout,
  Watering: Droplets,
  Harvesting: Wheat,
  Fertilizing: FlaskConical,
  'Pest Control': ShieldAlert,
  Pruning: Scissors,
  Tilling: Tractor,
  Weeding: Sprout,
  'Soil Treatment': FlaskConical,
  'General Inspection': CheckCircle2
};

const ACTIVITY_COLORS: Record<FarmActivityType, { bg: string; text: string; dot: string }> = {
  Planting: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  Watering: { bg: 'bg-sky-100', text: 'text-sky-800', dot: 'bg-sky-500' },
  Harvesting: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  Fertilizing: { bg: 'bg-lime-100', text: 'text-lime-800', dot: 'bg-lime-600' },
  'Pest Control': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-600' },
  Pruning: { bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-600' },
  Tilling: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-600' },
  Weeding: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' },
  'Soil Treatment': { bg: 'bg-stone-100', text: 'text-stone-800', dot: 'bg-stone-600' },
  'General Inspection': { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-600' }
};

export const FarmTaskCalendarView: React.FC<FarmTaskCalendarViewProps> = ({
  logs,
  onToggleStatus,
  onEditLog,
  onDeleteLog,
  onAddNewForDate,
  onVerifyPhoto
}) => {
  // Calendar current view date
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Selected tapped date string (YYYY-MM-DD), default to today
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(todayStr);
  };

  // Map logs by date string
  const logsByDate = useMemo(() => {
    const map = new Map<string, FarmTaskLog[]>();
    logs.forEach((log) => {
      const existing = map.get(log.date) || [];
      existing.push(log);
      map.set(log.date, existing);
    });
    return map;
  }, [logs]);

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    // First day of current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    // Total days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Total days in previous month
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      tasks: FarmTaskLog[];
    }[] = [];

    // Preceding padding days from prev month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const d = new Date(currentYear, currentMonth - 1, prevDay);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      days.push({
        dateStr,
        dayNumber: prevDay,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasks: logsByDate.get(dateStr) || []
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const yyyy = currentYear;
      const mm = String(currentMonth + 1).padStart(2, '0');
      const dd = String(i).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        tasks: logsByDate.get(dateStr) || []
      });
    }

    // Following padding days to fill 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasks: logsByDate.get(dateStr) || []
      });
    }

    return days;
  }, [currentYear, currentMonth, logsByDate, todayStr]);

  // Tasks for the currently selected date
  const selectedDayTasks = useMemo(() => {
    return logsByDate.get(selectedDateStr) || [];
  }, [logsByDate, selectedDateStr]);

  // Format month name
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Format selected date nicely
  const formattedSelectedDate = useMemo(() => {
    try {
      const parts = selectedDateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch {
      // fallback
    }
    return selectedDateStr;
  }, [selectedDateStr]);

  // Month stats
  const totalMonthTasks = useMemo(() => {
    return calendarDays
      .filter((d) => d.isCurrentMonth)
      .reduce((sum, d) => sum + d.tasks.length, 0);
  }, [calendarDays]);

  return (
    <div className="space-y-4">
      {/* Calendar Card Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        {/* Month Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  {monthName}
                </h3>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  {totalMonthTasks} Tasks Synced
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap on any day to view scheduled field activities, irrigation, and harvest logs.
              </p>
            </div>
          </div>

          {/* Month Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleJumpToToday}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Today
            </button>

            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span className="font-semibold">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="font-semibold">Scheduled</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="font-semibold flex items-center space-x-0.5">
              <Flame className="w-3 h-3 text-rose-600" />
              <span>Urgent / High Priority</span>
            </span>
          </div>
          <div className="ml-auto text-[11px] text-slate-400">
            Selected: <strong className="text-slate-700">{selectedDateStr}</strong>
          </div>
        </div>

        {/* Weekday Column Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-black text-slate-400 uppercase tracking-wider py-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const hasTasks = day.tasks.length > 0;
            const hasUrgent = day.tasks.some((t) => t.priority === 'High' && t.status !== 'Completed');
            const hasScheduled = day.tasks.some((t) => t.status === 'Scheduled');
            const allCompleted = hasTasks && day.tasks.every((t) => t.status === 'Completed');

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDateStr(day.dateStr)}
                className={`min-h-[64px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 relative ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/50 shadow-sm'
                    : day.isToday
                    ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-300'
                    : day.isCurrentMonth
                    ? 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    : 'border-slate-100 bg-slate-50/50 text-slate-300 opacity-60'
                }`}
              >
                {/* Day Header (Number and badges) */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-black rounded-lg w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                      day.isToday
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : isSelected
                        ? 'bg-emerald-700 text-white'
                        : day.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {/* Task Count Badge */}
                  {hasTasks && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                        hasUrgent
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : allCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {day.tasks.length}
                    </span>
                  )}
                </div>

                {/* Day Task Indicators */}
                <div className="w-full mt-1 space-y-1">
                  {/* Desktop Preview Chips */}
                  <div className="hidden sm:block space-y-0.5">
                    {day.tasks.slice(0, 2).map((t) => {
                      const col = ACTIVITY_COLORS[t.activityType] || ACTIVITY_COLORS['General Inspection'];
                      return (
                        <div
                          key={t.id}
                          className={`text-[9px] font-bold px-1 py-0.5 rounded truncate flex items-center space-x-1 ${
                            t.status === 'Completed'
                              ? 'bg-slate-100 text-slate-600 line-through'
                              : `${col.bg} ${col.text}`
                          }`}
                          title={`${t.activityType}: ${t.crop} (${t.plotName})`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              t.priority === 'High' ? 'bg-rose-600' : col.dot
                            }`}
                          ></span>
                          <span className="truncate">{t.crop}</span>
                        </div>
                      );
                    })}
                    {day.tasks.length > 2 && (
                      <span className="text-[8px] font-bold text-slate-400 pl-0.5 block">
                        +{day.tasks.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Mobile Dot Indicators */}
                  <div className="sm:hidden flex items-center space-x-1 flex-wrap pt-0.5">
                    {day.tasks.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'Completed'
                            ? 'bg-emerald-600'
                            : t.priority === 'High'
                            ? 'bg-rose-600'
                            : 'bg-amber-500'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Task Detail Panel */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        {/* Selected Date Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black">
              <Calendar className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-black text-slate-900 text-sm sm:text-base">
                  {formattedSelectedDate}
                </h4>
                {selectedDateStr === todayStr && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedDayTasks.length === 0
                  ? 'No tasks logged for this date.'
                  : `${selectedDayTasks.length} task(s) recorded for this day.`}
              </p>
            </div>
          </div>

          {/* Quick Add Button pre-filled for this day */}
          <button
            onClick={() => onAddNewForDate(selectedDateStr)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task for this Day</span>
          </button>
        </div>

        {/* Selected Day Task Cards */}
        {selectedDayTasks.length === 0 ? (
          <div className="text-center py-8 space-y-3 bg-slate-50 rounded-2xl border border-slate-200/60 p-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarDays className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-600 font-bold">
              No farm operations or logs scheduled for {selectedDateStr}.
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Plan ahead by logging planting, irrigation, or harvesting activities for this date.
            </p>
            <button
              onClick={() => onAddNewForDate(selectedDateStr)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-sm inline-flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Farm Activity on {selectedDateStr}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDayTasks.map((task) => {
              const Icon = ACTIVITY_ICONS[task.activityType] || CheckCircle2;
              const isDone = task.status === 'Completed';
              const isScheduled = task.status === 'Scheduled';
              const isHigh = task.priority === 'High';
              const col = ACTIVITY_COLORS[task.activityType] || ACTIVITY_COLORS['General Inspection'];

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all shadow-xs ${
                    isDone
                      ? 'bg-slate-50 border-slate-200 opacity-90'
                      : isHigh
                      ? 'bg-white border-rose-300 ring-1 ring-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Icon & Title */}
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${col.bg} ${col.text}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${col.bg} ${col.text}`}
                          >
                            {task.activityType}
                          </span>

                          <span className="text-xs font-black text-slate-900">{task.crop}</span>

                          {/* Priority badge */}
                          {task.priority === 'High' ? (
                            <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-2xs">
                              <Flame className="w-3 h-3 text-rose-600" />
                              <span>HIGH PRIORITY</span>
                            </span>
                          ) : task.priority === 'Medium' ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>MEDIUM</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              LOW
                            </span>
                          )}

                          {task.isOrganicCertified && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Organic
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-slate-700">{task.plotName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Time, Status Toggle & Action buttons */}
                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      {task.time && (
                        <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{task.time}</span>
                        </span>
                      )}

                      {/* Status Toggle */}
                      <button
                        onClick={() => onToggleStatus(task.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center space-x-1 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isScheduled
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                            : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                        }`}
                        title="Click to toggle completion status"
                      >
                        {isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Done</span>
                          </>
                        ) : (
                          <span>Mark Done</span>
                        )}
                      </button>

                      {/* Edit, Photo & Delete */}
                      {onVerifyPhoto && (
                        <button
                          onClick={() => onVerifyPhoto(task)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            task.photoUrl
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                          }`}
                          title={task.photoUrl ? 'View verified photo proof' : 'Verify with photo'}
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onEditLog(task)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteLog(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Photo Verification Banner if attached */}
                  {task.photoUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={task.photoUrl}
                          alt="Verification proof"
                          className="w-10 h-10 rounded-lg object-cover border border-emerald-300 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center space-x-1 w-max">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            <span>Work Verified with Photo</span>
                          </span>
                          {task.photoTimestamp && (
                            <span className="text-[9px] text-slate-400 block mt-0.5">
                              {new Date(task.photoTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {onVerifyPhoto && (
                        <button
                          onClick={() => onVerifyPhoto(task)}
                          className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          View Full Photo
                        </button>
                      )}
                    </div>
                  )}

                  {/* Task Metrics & Notes */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    {task.quantityOrMetric && (
                      <div className="bg-slate-100 text-slate-800 font-extrabold px-2 py-0.5 rounded-lg text-[11px]">
                        <span className="text-slate-400 font-normal">Metric:</span>{' '}
                        <span className="text-emerald-800">{task.quantityOrMetric}</span>
                      </div>
                    )}

                    <div className="bg-slate-50 text-slate-700 font-semibold px-2 py-0.5 rounded-lg text-[11px] flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{task.durationHours} hrs</span>
                    </div>

                    <div className="bg-slate-50 text-slate-700 font-semibold px-2 py-0.5 rounded-lg text-[11px] flex items-center space-x-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{task.workersCount} workers</span>
                    </div>

                    {task.costETB && (
                      <div className="bg-slate-50 text-slate-700 font-semibold px-2 py-0.5 rounded-lg text-[11px] flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        <span>{task.costETB.toLocaleString()} ETB</span>
                      </div>
                    )}
                  </div>

                  {task.notes && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                      <strong className="text-slate-800">Notes:</strong> {task.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
