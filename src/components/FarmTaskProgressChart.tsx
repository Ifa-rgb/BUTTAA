import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { FarmTaskLog } from '../types';
import { CheckCircle2, Clock, Calendar, TrendingUp, Info } from 'lucide-react';

interface FarmTaskProgressChartProps {
  logs: FarmTaskLog[];
}

interface DayStat {
  dateStr: string;
  displayDay: string;
  weekday: string;
  completed: number;
  pending: number;
  total: number;
  completedItems: string[];
  pendingItems: string[];
}

export const FarmTaskProgressChart: React.FC<FarmTaskProgressChartProps> = ({ logs }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DayStat | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Compute 7 days range
  const sevenDaysData = useMemo<DayStat[]>(() => {
    // Determine anchor date from latest log date or current date
    let anchor = new Date();
    if (logs.length > 0) {
      const dates = logs.map((l) => new Date(l.date).getTime()).filter((t) => !isNaN(t));
      if (dates.length > 0) {
        anchor = new Date(Math.max(...dates));
      }
    }

    const days: DayStat[] = [];
    // Last 7 days leading up to anchor
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const dayLogs = logs.filter((l) => l.date === dateStr);
      const completed = dayLogs.filter((l) => l.status === 'Completed');
      const pending = dayLogs.filter((l) => l.status === 'Scheduled' || l.status === 'In Progress');

      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      days.push({
        dateStr,
        displayDay,
        weekday,
        completed: completed.length,
        pending: pending.length,
        total: dayLogs.length,
        completedItems: completed.map((l) => `${l.activityType} (${l.crop})`),
        pendingItems: pending.map((l) => `${l.activityType} (${l.crop})`)
      });
    }

    return days;
  }, [logs]);

  // Aggregate stats
  const totalCompleted7d = useMemo(
    () => sevenDaysData.reduce((acc, d) => acc + d.completed, 0),
    [sevenDaysData]
  );
  const totalPending7d = useMemo(
    () => sevenDaysData.reduce((acc, d) => acc + d.pending, 0),
    [sevenDaysData]
  );
  const totalTasks7d = totalCompleted7d + totalPending7d;
  const completionRate =
    totalTasks7d > 0 ? Math.round((totalCompleted7d / totalTasks7d) * 100) : 100;

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || sevenDaysData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 640;
    const height = 240;
    const margin = { top: 25, right: 20, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Outer group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Days)
    const x0 = d3
      .scaleBand()
      .domain(sevenDaysData.map((d) => d.dateStr))
      .range([0, innerWidth])
      .paddingInner(0.25);

    // Sub-scale for Grouped Bars: Completed vs Pending
    const keys = ['completed', 'pending'] as const;
    const x1 = d3
      .scaleBand<string>()
      .domain(keys)
      .range([0, x0.bandwidth()])
      .padding(0.12);

    // Y Scale
    const maxVal = d3.max(sevenDaysData, (d: DayStat) => Math.max(d.completed, d.pending)) || 1;
    const yMax = Math.max(maxVal + 1, 3);

    const y = d3.scaleLinear().domain([0, yMax]).nice().range([innerHeight, 0]);

    // Color Scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(['completed', 'pending'])
      .range(['#059669', '#f59e0b']); // emerald-600 & amber-500

    // Horizontal Grid Lines
    const yTicks = y.ticks(Math.min(yMax, 5));
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d: number) => y(d))
      .attr('y2', (d: number) => y(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '3,3');

    // Day groups
    const dayGroups = g
      .selectAll<SVGGElement, DayStat>('.day-group')
      .data(sevenDaysData)
      .enter()
      .append('g')
      .attr('class', 'day-group')
      .attr('transform', (d: DayStat) => `translate(${x0(d.dateStr)},0)`);

    // Add subtle background column highlight on hover
    dayGroups
      .append('rect')
      .attr('class', 'column-hover-bg')
      .attr('x', -2)
      .attr('y', 0)
      .attr('width', x0.bandwidth() + 4)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('rx', 6)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event: MouseEvent, d: DayStat) {
        d3.select(this).attr('fill', 'rgba(241, 245, 249, 0.7)');
        setHoveredDay(d);
        const [mx, my] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x: mx, y: my });
      })
      .on('mousemove', function (event: MouseEvent) {
        const [mx, my] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x: mx, y: my });
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', 'transparent');
        setHoveredDay(null);
        setTooltipPos(null);
      });

    // Bars
    keys.forEach((key) => {
      dayGroups
        .append('rect')
        .attr('class', `bar-${key}`)
        .attr('x', x1(key) || 0)
        .attr('y', innerHeight)
        .attr('width', x1.bandwidth())
        .attr('height', 0)
        .attr('fill', color(key))
        .attr('rx', 4)
        .attr('ry', 4)
        .transition()
        .duration(650)
        .ease(d3.easeCubicOut)
        .attr('y', (d: DayStat) => y(d[key]))
        .attr('height', (d: DayStat) => innerHeight - y(d[key]));

      // Value label on top of bar if count > 0
      dayGroups
        .append('text')
        .attr('x', (x1(key) || 0) + x1.bandwidth() / 2)
        .attr('y', (d: DayStat) => (d[key] > 0 ? y(d[key]) - 4 : innerHeight))
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('fill', key === 'completed' ? '#047857' : '#b45309')
        .attr('opacity', 0)
        .text((d: DayStat) => (d[key] > 0 ? d[key] : ''))
        .transition()
        .delay(350)
        .duration(300)
        .attr('opacity', 1);
    });

    // X Axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x0)
          .tickSize(0)
          .tickFormat((d) => {
            const item = sevenDaysData.find((x) => x.dateStr === d);
            return item ? `${item.weekday}` : d;
          })
      );

    xAxis.select('.domain').attr('stroke', '#cbd5e1');
    xAxis
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', '#475569')
      .attr('dy', '10px');

    // Sub-label for date under weekday
    sevenDaysData.forEach((d) => {
      g.append('text')
        .attr('x', (x0(d.dateStr) || 0) + x0.bandwidth() / 2)
        .attr('y', innerHeight + 24)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('font-weight', '500')
        .attr('fill', '#94a3b8')
        .text(d.displayDay.split(' ')[1] || '');
    });

    // Y Axis
    const yAxis = g
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(Math.min(yMax, 4))
          .tickFormat(d3.format('d'))
          .tickSize(0)
      );

    yAxis.select('.domain').remove();
    yAxis
      .selectAll('text')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8')
      .attr('dx', '-4px');
  }, [sevenDaysData]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 relative overflow-hidden space-y-4"
    >
      {/* Header and Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              Progress Summary (Last 7 Days)
            </h3>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              D3 Interactive Visualizer
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare daily completed farm tasks against pending & scheduled activities.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block shadow-xs"></span>
            <span className="font-bold text-slate-700">Completed ({totalCompleted7d})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block shadow-xs"></span>
            <span className="font-bold text-slate-700">Pending ({totalPending7d})</span>
          </div>
        </div>
      </div>

      {/* KPI Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            7-Day Tasks Logged
          </span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">{totalTasks7d} Tasks</span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Completed Activities
          </span>
          <span className="text-lg font-black text-emerald-700 mt-0.5 block flex items-center space-x-1">
            <span>{totalCompleted7d}</span>
            <span className="text-xs font-semibold text-emerald-600">Tasks</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Pending / Scheduled
          </span>
          <span className="text-lg font-black text-amber-800 mt-0.5 block flex items-center space-x-1">
            <span>{totalPending7d}</span>
            <span className="text-xs font-semibold text-amber-700">Tasks</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200/70">
          <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
            Completion Rate
          </span>
          <span className="text-lg font-black text-sky-800 mt-0.5 block">
            {completionRate}%{' '}
            <span className="text-[11px] font-bold text-emerald-600">On Track</span>
          </span>
        </div>
      </div>

      {/* D3 Bar Chart Canvas */}
      <div className="w-full overflow-x-auto scrollbar-none pt-1">
        <div className="min-w-[500px]">
          <svg
            ref={svgRef}
            viewBox="0 0 640 240"
            className="w-full h-auto max-h-[240px] select-none"
          />
        </div>
      </div>

      {/* Dynamic Hover Tooltip Info card */}
      {hoveredDay ? (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-slate-800 text-amber-300 font-black">
              {hoveredDay.weekday}, {hoveredDay.displayDay}
            </span>
            <span className="text-slate-300">
              {hoveredDay.total} total {hoveredDay.total === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{hoveredDay.completed} Completed: {hoveredDay.completedItems.join(', ') || 'None'}</span>
            </span>
            {hoveredDay.pending > 0 && (
              <span className="text-amber-400 font-bold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{hoveredDay.pending} Pending: {hoveredDay.pendingItems.join(', ')}</span>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Hover or tap any daily column to inspect logged tasks and crop details.</span>
          </span>
          <span className="font-bold text-slate-700">
            {totalCompleted7d} completed • {totalPending7d} pending
          </span>
        </div>
      )}
    </div>
  );
};
