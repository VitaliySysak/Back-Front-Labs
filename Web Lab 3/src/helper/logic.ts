function toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

export function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    const R = 6371;
    const lat1 = toRadians(latitude1);
    const lon1 = toRadians(longitude1);
    const lat2 = toRadians(latitude2);
    const lon2 = toRadians(longitude2);
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; 
  }

export const createdAt = new Date();
createdAt.setHours(2);
createdAt.setMinutes(0);
createdAt.setMilliseconds(0);
createdAt.setSeconds(0);