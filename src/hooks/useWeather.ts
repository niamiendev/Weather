import { WeatherModel } from "@/models/all-models";
import { buildWeatherUrl } from "@/utils/geo";
import { useEffect, useState } from "react";

export function useWeather(latitude: number, longitude: number) {
  const [data, setData] = useState<WeatherModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const res = await fetch(buildWeatherUrl(latitude, longitude));
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const json: WeatherModel = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);

  return { data, loading };
}
