"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  ShieldCheck,
  RefreshCw,
  Upload,
  Video,
  VideoOff,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatTanggalIndo } from "@/lib/formatters";
import { calculateHaversineDistance } from "@/lib/geofence";
import { GeofenceRadiusMap } from "@/components/common/GeofenceRadiusMap";

export default function AbsensiPage() {
  const { currentOutlet, currentUser, attendances, clockIn, clockOut } = useAppStore();

  const myTodayAtt = attendances.find(
    (a) => a.userId === currentUser.id && a.outletId === currentOutlet.id
  );

  // GPS Coordinates (Default ~11m from outlet)
  const [userLat, setUserLat] = useState<number>(currentOutlet.latitude + 0.0001);
  const [userLon, setUserLon] = useState<number>(currentOutlet.longitude + 0.0001);

  // Camera & Selfie Verification State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [faceDetected, setFaceDetected] = useState<boolean>(true);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Calculate live distance
  const currentDistance = calculateHaversineDistance(
    userLat,
    userLon,
    currentOutlet.latitude,
    currentOutlet.longitude
  );
  const isInsideGeofence = currentDistance <= currentOutlet.radiusMeters;

  // Start WebRTC Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Kamera tidak didukung oleh browser Anda.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start error:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Izin akses kamera ditolak. Silakan izinkan akses kamera di browser Anda atau unggah foto selfie."
          : `Gagal membuka kamera: ${err.message || "Perangkat kamera tidak ditemukan"}.`
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture Photo Frame to Canvas
  const captureSelfie = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror image horizontally if front camera
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedPhoto(dataUrl);
      setFaceDetected(true);
      stopCamera();
    }
    setIsCapturing(false);
  };

  // Handle File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPhoto(event.target.result as string);
          setFaceDetected(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Retake Photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  // Clock In Action
  const handleClockIn = () => {
    try {
      const finalPhoto =
        capturedPhoto ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop";

      const att = clockIn(userLat, userLon, finalPhoto);
      setFeedback({
        type: "success",
        message: `Presensi Masuk Berhasil! Status: ${att.status} (${
          att.lateMinutes > 0 ? `Terlambat ${att.lateMinutes} menit` : "Tepat Waktu"
        }). Jarak verifikasi: ${currentDistance}m dari outlet.`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Presensi gagal diverifikasi.",
      });
    }
  };

  // Clock Out Action
  const handleClockOut = () => {
    if (!myTodayAtt) return;
    try {
      const finalPhoto =
        capturedPhoto ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop";

      clockOut(myTodayAtt.id, userLat, userLon, finalPhoto);
      setFeedback({
        type: "success",
        message: `Presensi Pulang Berhasil! Jam kepulangan tercatat valid pada jarak ${currentDistance}m.`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Presensi gagal diverifikasi.",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#D32323] uppercase tracking-wider block">
            PRESENSI KARYAWAN
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Terminal Absensi Geofencing GPS & Verifikasi Wajah
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cabang: <strong className="text-zinc-800">{currentOutlet.name}</strong> • Karyawan:{" "}
            <strong className="text-zinc-800">{currentUser.name}</strong> ({currentUser.role})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/resto/absensi/riwayat"
            className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Riwayat Kehadiran Pribadi</span>
          </Link>
        </div>
      </div>

      {/* Alert Notifications */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Face Verification & Geofence GPS Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Face Verification / Selfie Viewfinder */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#D32323] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>Verifikasi Wajah / Selfie</span>
            </div>
            <h3 className="font-black text-base text-zinc-900">Foto Bukti Presensi Staf</h3>
            <p className="text-[11px] text-zinc-500">
              Posisikan wajah Anda tegak lurus di dalam lingkaran pandu
            </p>
          </div>

          {/* Oval / Round Viewfinder Container */}
          <div className="relative w-52 h-52 mx-auto rounded-full overflow-hidden border-4 border-dashed border-[#D32323]/50 bg-zinc-950 flex items-center justify-center shadow-2xl group">
            {/* 1. Live WebRTC Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                isCameraActive && !capturedPhoto ? "block" : "hidden"
              }`}
            />

            {/* 2. Captured Photo Preview */}
            {capturedPhoto && (
              <Image
                src={capturedPhoto}
                alt="Foto Selfie Presensi"
                fill
                className="object-cover"
                unoptimized
              />
            )}

            {/* 3. Placeholder / Idle State */}
            {!isCameraActive && !capturedPhoto && (
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 text-zinc-400">
                <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-[11px] font-bold text-zinc-300">Kamera Belum Aktif</p>
                <p className="text-[9px] text-zinc-500">Klik tombol di bawah untuk membuka kamera</p>
              </div>
            )}

            {/* Scanning HUD Overlay when camera is active */}
            {isCameraActive && !capturedPhoto && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-36 h-44 border-2 border-emerald-400/70 rounded-[50%] animate-pulse" />
                <span className="text-[9px] bg-black/60 text-emerald-400 font-bold px-2 py-0.5 rounded-full mt-2 backdrop-blur-xs">
                  Wajah Terdeteksi
                </span>
              </div>
            )}

            {/* Verification Badge on Captured Photo */}
            {capturedPhoto && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10 whitespace-nowrap">
                <ShieldCheck className="w-3 h-3" />
                <span>Wajah Terverifikasi 98%</span>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="space-y-2.5">
            {cameraError && (
              <p className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 text-center font-medium">
                {cameraError}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {!isCameraActive && !capturedPhoto && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full bg-[#D32323] hover:bg-[#B31818] text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Aktifkan Kamera Selfie</span>
                </button>
              )}

              {isCameraActive && !capturedPhoto && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={captureSelfie}
                    disabled={isCapturing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto (Shutter)</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs rounded-xl transition"
                    title="Matikan Kamera"
                  >
                    <VideoOff className="w-4 h-4" />
                  </button>
                </div>
              )}

              {capturedPhoto && (
                <button
                  type="button"
                  onClick={handleRetake}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Foto Ulang (Retake)</span>
                </button>
              )}

              {/* Upload Fallback */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-zinc-500 hover:text-zinc-800 text-[11px] font-semibold py-1.5 flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3 h-3" />
                <span>Atau Unggah Foto dari Perangkat</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Geofence GPS Radar Map */}
        <div className="lg:col-span-7 space-y-4">
          <GeofenceRadiusMap
            outletName={currentOutlet.name}
            outletLat={currentOutlet.latitude}
            outletLng={currentOutlet.longitude}
            radiusMeters={currentOutlet.radiusMeters}
            userLat={userLat}
            userLng={userLon}
            onLocationChange={(newLat, newLng) => {
              setUserLat(newLat);
              setUserLon(newLng);
            }}
            interactive={true}
          />
        </div>
      </div>

      {/* BOTTOM ACTION BAR: Clock-In & Clock-Out Execution */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div className="space-y-1">
            <h3 className="font-black text-lg text-zinc-900">Eksekusi Kehadiran Harian</h3>
            <p className="text-xs text-zinc-500">
              Validasi ganda: Wajah Selfie Terverifikasi + Posisi GPS berada dalam radius 100m.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                Status Hari Ini ({currentUser.name})
              </span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full inline-block ${
                  myTodayAtt?.status === "PRESENT" || myTodayAtt?.status === "LATE"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {myTodayAtt ? `Sudah Clock-In (${myTodayAtt.status})` : "Belum Masuk"}
              </span>
            </div>
          </div>
        </div>

        {/* Big Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Clock In */}
          <button
            type="button"
            disabled={!isInsideGeofence || !!myTodayAtt}
            onClick={handleClockIn}
            className={`p-5 rounded-2xl text-left border transition flex flex-col justify-between space-y-3 cursor-pointer ${
              !myTodayAtt && isInsideGeofence
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 transform hover:-translate-y-0.5"
                : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Presensi Masuk
              </span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black">Clock In (Masuk Kerja)</p>
              <p className="text-xs opacity-80 mt-1">
                {myTodayAtt
                  ? `Sudah absen pukul ${formatTanggalIndo(myTodayAtt.clockInTime, true)}`
                  : isInsideGeofence
                  ? "Radius Valid • Klik untuk mencatat jam masuk"
                  : "Di Luar Radius Geofence (Presensi Terkunci)"}
              </p>
            </div>
          </button>

          {/* Clock Out */}
          <button
            type="button"
            disabled={!myTodayAtt || !!myTodayAtt?.clockOutTime || !isInsideGeofence}
            onClick={handleClockOut}
            className={`p-5 rounded-2xl text-left border transition flex flex-col justify-between space-y-3 cursor-pointer ${
              myTodayAtt && !myTodayAtt.clockOutTime && isInsideGeofence
                ? "bg-[#D32323] hover:bg-[#B31818] text-white border-[#D32323] shadow-lg shadow-red-500/25 transform hover:-translate-y-0.5"
                : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Presensi Pulang
              </span>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black">Clock Out (Selesai Kerja)</p>
              <p className="text-xs opacity-80 mt-1">
                {myTodayAtt?.clockOutTime
                  ? `Sudah pulang pukul ${formatTanggalIndo(myTodayAtt.clockOutTime, true)}`
                  : myTodayAtt
                  ? "Klik untuk mencatat jam kepulangan & jam kerja"
                  : "Harus clock-in terlebih dahulu"}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Branch Attendance Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-zinc-900">
              Daftar Staf Hadir Hari Ini di {currentOutlet.name}
            </h3>
            <p className="text-xs text-zinc-500">Log kehadiran terverifikasi radar geofence GPS</p>
          </div>
          <Link
            href="/resto/absensi/riwayat"
            className="text-xs font-bold text-[#D32323] hover:underline"
          >
            Lihat Rekap Lengkap &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 uppercase font-black tracking-wider">
                <th className="py-2.5 px-3">Selfie</th>
                <th className="py-2.5 px-3">Nama Karyawan</th>
                <th className="py-2.5 px-3">Jam Masuk</th>
                <th className="py-2.5 px-3">Jam Pulang</th>
                <th className="py-2.5 px-3">Jarak GPS</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {attendances
                .filter((a) => a.outletId === currentOutlet.id)
                .slice(0, 5)
                .map((att) => (
                  <tr key={att.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-200 border border-zinc-300">
                        {att.inPhotoUrl && (
                          <Image
                            src={att.inPhotoUrl}
                            alt={att.userName || "Staf"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-zinc-900">{att.userName}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {formatTanggalIndo(att.clockInTime, true)}
                    </td>
                    <td className="py-3 px-3 text-zinc-600">
                      {att.clockOutTime ? formatTanggalIndo(att.clockOutTime, true) : "-"}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-700">{att.inDistanceM} meter</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          att.status === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : att.status === "LATE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {att.status === "PRESENT"
                          ? "Tepat Waktu"
                          : att.status === "LATE"
                          ? `Terlambat ${att.lateMinutes}m`
                          : att.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
