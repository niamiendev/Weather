import { WeatherModel } from "@/models/all-models";
import axios from "axios";
import { useEffect, useState } from "react";

const url =
  "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_min,temperature_2m_max&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,weather_code,rain,precipitation,wind_direction_10m&timezone=GMT&utm_source=chatgpt.com";

export function useWeather() {
  const [data, setData] = useState<WeatherModel>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = () => {
      axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          setData(res.data as WeatherModel);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchWeather();
  }, []);

  return { data, loading, error };
}
