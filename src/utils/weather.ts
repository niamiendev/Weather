import { Ionicons } from "@expo/vector-icons";

type WeatherIconName = keyof typeof Ionicons.glyphMap;

export const getWeatherIcon = (code: number): WeatherIconName => {
  if (code === 0) return "sunny";
  if (code === 1) return "sunny-outline";
  if (code === 2) return "partly-sunny";
  if (code === 3) return "cloudy";

  if (code === 45 || code === 48) return "cloud";

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "rainy-outline";
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "rainy";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "snow";
  }

  if ([95, 96, 97, 99].includes(code)) {
    return "thunderstorm";
  }

  return "cloud-outline";
};
