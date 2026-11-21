export type Place = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export async function searchPlace(query: string): Promise<Place | null> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim(),
    )}&count=1&language=fr&format=json`,
  );

  if (!res.ok) throw new Error("Erreur de géocodage");

  const json = await res.json();
  const r = json.results?.[0];
  if (!r) return null;

  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

export function buildWeatherUrl(latitude: number, longitude: number) {
  return (
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&daily=weather_code,temperature_2m_min,temperature_2m_max` +
    `&hourly=temperature_2m,weather_code` +
    `&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,weather_code,rain,precipitation,wind_direction_10m` +
    `&timezone=auto`
  );
}
