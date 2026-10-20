import React, { useState, useEffect, useRef } from 'react';
import { FarmTaskLog, FarmActivityType } from '../types';
import {
  Camera,
  RotateCw,
  Upload,
  CheckCircle2,
  X,
  AlertTriangle,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Check,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  Eye,
  Layers
} from 'lucide-react';

interface TaskPhotoVerificationModalProps {
  task: FarmTaskLog;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (
    photoUrl: string,
    photoTimestamp: string,
    verificationNote: string,
    markCompleted: boolean
  ) => void;
  onRemovePhoto?: () => void;
}

// Curated realistic agricultural verification samples matching farming activities
const ACTIVITY_SAMPLE_PHOTOS: Record<
  FarmActivityType,
  { title: string; url: string; note: string }[]
> = {
  Harvesting: [
    {
      title: 'Arabica Coffee Cherries on Drying Tables',
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      note: 'Harvest verified: Ripe red cherries gathered and spread on raised beds.'
    },
    {
      title: 'Freshly Picked Roma Tomatoes in Crates',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      note: 'Harvest verified: Clean graded crates ready for local market distribution.'
    },
    {
      title: 'Harvested Maize Cobs at Field Edge',
      url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      note: 'Harvest verified: Healthy full ears harvested from Section 2.'
    }
  ],
  Watering: [
    {
      title: 'Active Terrace Drip Irrigation Line',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      note: 'Watering verified: Drip pressure uniform, root zone moisture probed.'
    },
    {
      title: 'Furrow Flooding in Vegetable Plot',
      url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      note: 'Watering verified: Furrow canals fully supplied, no runoff erosion.'
    }
  ],
  Planting: [
    {
      title: 'Teff Seedbed Even Broadcast Sowing',
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      note: 'Planting verified: Fine crumb seedbed broadcasted with certified seeds.'
    },
    {
      title: 'Healthy Nursery Seedling Beds',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      note: 'Planting verified: Seedling transplants rooted into raised beds.'
    }
  ],
  Fertilizing: [
    {
      title: 'Organic Compost Top-Dressing',
      url: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
      note: 'Fertilizing verified: 300kg well-decomposed manure compost applied.'
    }
  ],
  'Pest Control': [
    {
      title: 'Organic Neem Botanical Spray Application',
      url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
      note: 'Pest Control verified: Foliar spray applied to underside of leaves.'
    }
  ],
  Pruning: [
    {
      title: 'Canopy Thinning & Sucker Pruning',
      url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
      note: 'Pruning verified: Diseased wood and dead branches removed.'
    }
  ],
  Tilling: [
    {
      title: 'Secondary Furrow Soil Preparation',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      note: 'Tilling verified: Soil loosened to 20cm depth, clods pulverized.'
    }
  ],
  Weeding: [
    {
      title: 'Hand-Weeded Crop Rows',
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      note: 'Weeding verified: Grass weeds removed from row alleys.'
    }
  ],
  'Soil Treatment': [
    {
      title: 'Biochar & Compost Soil Conditioning',
      url: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
      note: 'Soil treatment verified: Mineral conditioning applied.'
    }
  ],
  'General Inspection': [
    {
      title: 'Field Terrace Overview & Crop Health Audit',
      url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      note: 'Inspection verified: Field boundaries and crop stand examined.'
    }
  ]
};

export const TaskPhotoVerificationModal: React.FC<TaskPhotoVerificationModalProps> = ({
  task,
  isOpen,
  onClose,
  onSavePhoto,
  onRemovePhoto
}) => {
  const [mode, setMode] = useState<'camera' | 'preview' | 'viewExisting'>('camera');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(task.photoUrl || null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [verificationNote, setVerificationNote] = useState<string>(
    task.photoVerificationNote || `Verified ${task.activityType.toLowerCase()} on ${task.crop} (${task.plotName}).`
  );
  const [autoMarkCompleted, setAutoMarkCompleted] = useState<boolean>(task.status !== 'Completed');
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize view mode
  useEffect(() => {
    if (isOpen) {
      if (task.photoUrl) {
        setCapturedPhotoUrl(task.photoUrl);
        setMode('viewExisting');
      } else {
        setCapturedPhotoUrl(null);
        setMode('camera');
      }
      setVerificationNote(
        task.photoVerificationNote ||
          `Verified ${task.activityType.toLowerCase()} on ${task.crop} (${task.plotName}).`
      );
      setAutoMarkCompleted(task.status !== 'Completed');
    }
  }, [isOpen, task]);

  // Handle camera stream start/stop
  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access API not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraActive(false);
      setCameraError(
        err?.message ||
          'Unable to access camera hardware. You can capture or upload using your device photo gallery, or pick a verified field photo preset.'
      );
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    // Trigger shutter flash animation
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Watermark audit text on bottom corner of image
      const now = new Date();
      const timestampText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()} • BUTTAA AUDIT`;
      const metaText = `${task.activityType.toUpperCase()}: ${task.crop} (${task.plotName})`;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, canvas.height - 48, canvas.width, 48);

      ctx.fillStyle = '#fef08a'; // amber-200
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`✓ WORK VERIFIED: ${metaText}`, 16, canvas.height - 26);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      ctx.fillText(timestampText, 16, canvas.height - 8);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCamera();
      setCapturedPhotoUrl(dataUrl);
      setMode('preview');
    }
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        stopCamera();
        setCapturedPhotoUrl(reader.result as string);
        setMode('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSamplePhoto = (sample: { url: string; note: string }) => {
    stopCamera();
    setCapturedPhotoUrl(sample.url);
    setVerificationNote(sample.note);
    setMode('preview');
  };

  const handleSave = () => {
    if (!capturedPhotoUrl) return;
    const timestamp = new Date().toISOString();
    onSavePhoto(capturedPhotoUrl, timestamp, verificationNote, autoMarkCompleted);
    onClose();
  };

  if (!isOpen) return null;

  const samplePresets = ACTIVITY_SAMPLE_PHOTOS[task.activityType] || ACTIVITY_SAMPLE_PHOTOS.Harvesting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-emerald-200 text-xs">
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-300">
                  Proof of Work Verification
                </span>
                <span>•</span>
                <span>Task #{task.id}</span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {task.activityType}: {task.crop} ({task.plotName})
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Mode 1: VIEW EXISTING PHOTO */}
          {mode === 'viewExisting' && task.photoUrl && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 shadow-md bg-slate-950 group">
                <img
                  src={task.photoUrl}
                  alt="Verified farm task work"
                  className="w-full h-64 sm:h-72 object-cover"
                />

                {/* Verification Stamp Banner */}
                <div className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-xs text-white border border-emerald-400/60 px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <div>
                    <span className="font-black text-xs text-amber-300 block">✓ Work Verified with Photo</span>
                    <span className="text-[10px] text-emerald-100">
                      Captured: {task.photoTimestamp ? new Date(task.photoTimestamp).toLocaleString() : task.date}
                    </span>
                  </div>
                </div>

                {/* Plot info watermark bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 text-white">
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-200">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{task.plotName}</span>
                  </div>
                  {task.photoVerificationNote && (
                    <p className="text-[11px] text-slate-200 mt-0.5">{task.photoVerificationNote}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhotoUrl(null);
                    setMode('camera');
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span>Take New Photo</span>
                </button>

                {onRemovePhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to remove the verification photo?')) {
                        onRemovePhoto();
                        onClose();
                      }
                    }}
                    className="text-rose-600 hover:text-rose-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: LIVE CAMERA VIEWFINDER */}
          {mode === 'camera' && (
            <div className="space-y-3.5">
              {/* Camera Video Container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border border-slate-800 shadow-inner">
                {/* Shutter flash effect */}
                {isShutterActive && (
                  <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200" />
                )}

                {/* Video Stream */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {/* Viewfinder Target Guidelines */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-lg" />
                      <div className="w-8 h-8 border-t-2 border-r-2 border-amber-400/80 rounded-tr-lg" />
                    </div>

                    <div className="text-center">
                      <span className="bg-slate-950/70 text-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/40 backdrop-blur-xs">
                        Align completed crop work inside frame
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <div className="w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl-lg" />
                      <div className="w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-tr-lg" />
                    </div>
                  </div>
                )}

                {/* Camera Fallback / Error State */}
                {!cameraActive && (
                  <div className="p-6 text-center text-slate-400 space-y-3 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs sm:text-sm">
                        Device Camera Ready
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {cameraError || 'Click Start Camera, select from device gallery, or pick a verified field photo preset.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Start Camera</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 border border-slate-700 shadow"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Gallery</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Flip camera button */}
                {cameraActive && (
                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs border border-white/20 transition-colors shadow-md z-20 flex items-center space-x-1"
                    title="Flip camera (front / back)"
                  >
                    <RotateCw className="w-4 h-4 text-amber-300" />
                  </button>
                )}
              </div>

              {/* Shutter Capture Button */}
              {cameraActive && (
                <div className="flex items-center justify-center space-x-4 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Choose from gallery or files"
                  >
                    <Upload className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 border-4 border-white shadow-xl flex items-center justify-center text-white transition-transform active:scale-90"
                    title="Capture Photo Now"
                  >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <Camera className="w-5 h-5 text-emerald-800" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Flip camera"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Hidden File Picker Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Verified Field Photo Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-[11px] flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Quick Verified Photo Presets ({task.activityType}):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center space-x-0.5"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload custom photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {samplePresets.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSamplePhoto(sample)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-500 text-left transition-all aspect-4/3 shadow-xs bg-slate-900"
                    >
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                          {sample.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: PHOTO PREVIEW & VERIFICATION CONFIRMATION */}
          {mode === 'preview' && capturedPhotoUrl && (
            <div className="space-y-3.5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-950">
                <img
                  src={capturedPhotoUrl}
                  alt="Captured farm task preview"
                  className="w-full h-64 sm:h-72 object-cover"
                />

                <div className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-xs text-white border border-emerald-400/60 px-3 py-1 rounded-xl shadow-lg flex items-center space-x-1.5 text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Photo Ready for Attachment</span>
                </div>
              </div>

              {/* Verification Field Note Input */}
              <div>
                <label className="font-extrabold text-slate-800 block mb-1">
                  Field Verification Note / Observation:
                </label>
                <input
                  type="text"
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="e.g. 14.5 quintals coffee cherries harvested and spread on drying tables..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 font-medium"
                />
              </div>

              {/* Audit Checkbox: Mark as Completed */}
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="markCompletedCheck"
                  checked={autoMarkCompleted}
                  onChange={(e) => setAutoMarkCompleted(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="markCompletedCheck"
                  className="text-xs font-bold text-emerald-950 cursor-pointer select-none"
                >
                  Mark this task status as <strong>"Completed"</strong> with verified photo proof
                </label>
              </div>

              {/* Retake vs Save Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhotoUrl(null);
                    setMode('camera');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ← Retake Photo
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-transform active:scale-95 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Attach Photo & Verify Work</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50 text-[11px] text-slate-500">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Audit Trail compliant with cooperative certification</span>
          </span>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
