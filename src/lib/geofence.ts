/**
 * Formula Haversine untuk menghitung jarak lingkaran besar antara 2 titik koordinat GPS
 * lat1, lon1: Koordinat staf / pengguna
 * lat2, lon2: Koordinat cabang resto D'Besto
 * Mengembalikan jarak dalam satuan meter (meters)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Pembulatan 1 desimal
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export interface GeofenceValidationResult {
  isValid: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
  message: string;
}

export function validateGeofence(
  userLat: number,
  userLon: number,
  outletLat: number,
  outletLon: number,
  allowedRadiusMeters = 100
): GeofenceValidationResult {
  const distance = calculateHaversineDistance(userLat, userLon, outletLat, outletLon);
  const isValid = distance <= allowedRadiusMeters;

  return {
    isValid,
    distanceMeters: distance,
    allowedRadiusMeters,
    message: isValid
      ? `Lokasi terverifikasi sah! Anda berada di dalam area resto (${distance}m dari pusat outlet, batas radius ${allowedRadiusMeters}m).`
      : `Presensi Ditolak! Anda berada di luar radius cabang resto (jarak terdeteksi: ${distance} meter, batas radius ${allowedRadiusMeters}m).`,
  };
}
