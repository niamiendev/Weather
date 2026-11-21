export interface WeatherModel {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
  hourly_units: HourlyUnits;
  hourly: Hourly;
  daily_units: DailyUnits;
  daily: Daily;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  is_day: string;
  wind_speed_10m: string;
  weather_code: string;
  rain: string;
  precipitation: string;
  wind_direction_10m: string;
}

export interface Current {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  is_day: number;
  wind_speed_10m: number;
  weather_code: number;
  rain: number;
  precipitation: number;
  wind_direction_10m: number;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  weather_code: string;
}

export interface Hourly {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_min: string;
  temperature_2m_max: string;
}

export interface Daily {
  time: string[];
  weather_code: number[];
  temperature_2m_min: number[];
  temperature_2m_max: number[];
}

export type DailyItem = {
  id: number;
  temp_max: number;
  temp_min: number;
  time: string;
  code: number;
};

export type HourlyItem = {
  id: number;
  temp: number;
  hour: string;
  code: number;
};
