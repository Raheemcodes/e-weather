export interface MetaInterface extends Card {
  keywords: string;
}

export interface Card {
  title: string;
  description: string;
  img: string;
  path: string;
}

export interface IPRes {
  asn: string;
  city: string;
  continent_code: string;
  country: string;
  country_area: number;
  country_calling_code: string;
  country_capital: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_population: number;
  country_tld: string;
  currency: string;
  currency_name: string;
  in_eu: false;
  ip: string;
  languages: string;
  latitude: number;
  longitude: number;
  network: string;
  org: string;
  postal: number | null;
  region: string;
  region_code: string;
  timezone: string;
  utc_offset: string;
  version: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface CurrentWeatherRes {
  current_weather: CurrentWeather;
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

export interface HourlyDailyWeatherForecast {
  time: string[];
  sunset: string[];
  sunrise: string[];
}

export interface DailyWeatherForecast {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: DailyUnits;
  daily: {
    time: string[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    windspeed_10m_max: number[];
    windgusts_10m_max: number[];
    apparent_temperature_min: number[];
    apparent_temperature_max: number[];
    winddirection_10m_dominant: number[];
    shortwave_radiation_sum: number[];
  };
}

export interface CurrentDailyWeatherRes {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  daily_units: {
    time: string[];
    sunset: string[];
    sunrise: string[];
  };
  daily: HourlyDailyWeatherForecast;
}

export interface RestructuredCurrentDailyWeatherRes {
  current_weather: CurrentWeather;
  daily: {
    time: string;
    sunset: string;
    sunrise: string;
  };
}

export interface DailyUnits {
  time: 'iso8601';
  weathercode: 'wmo code';
  sunrise: 'iso8601';
  sunset: 'iso8601';
  temperature_2m_max: '°C';
  temperature_2m_min: '°C';
  windspeed_10m_max: 'km/h';
  windgusts_10m_max: 'km/h';
  apparent_temperature_min: '°C';
  apparent_temperature_max: '°C';
  winddirection_10m_dominant: '°';
  shortwave_radiation_sum: 'MJ/m²';
}

export interface RestructuredDailyForecast {
  time: string;
  units: DailyUnits;
  // days: 'sunny' | 'night';
  weathercode: number;
  sunrise: string;
  sunset: string;
  temperature_2m_max: number;
  temperature_2m_min: number;
  windspeed_10m_max: number;
  windgusts_10m_max: number;
  apparent_temperature_min: number;
  apparent_temperature_max: number;
  winddirection_10m_dominant: number;
  shortwave_radiation_sum: number;
}

export interface HourlyRes {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  hourly: HourlyForcast;
  daily: HourlyDailyWeatherForecast;
}

export interface FullHourlyRes {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  hourly_units: HourlyUnit;
  hourly: FullHourlyForcast;
  daily: HourlyDailyWeatherForecast;
}

export interface HourlyUnit {
  time: string;
  temperature_2m: string;
  weathercode: string;
  relativehumidity_2m: string;
  dewpoint_2m: string;
  apparent_temperature: string;
  cloudcover: string;
  windspeed_10m: string;
  winddirection_10m: string;
  windgusts_10m: string;
  surface_pressure: string;
  direct_radiation: string;
}

export interface HourlyForcast {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
}

export interface FullHourlyForcast {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
  relativehumidity_2m: number[];
  dewpoint_2m: number[];
  apparent_temperature: number[];
  cloudcover: number[];
  windspeed_10m: number[];
  winddirection_10m: number[];
  windgusts_10m: number[];
  surface_pressure: number[];
  direct_radiation: number[];
}

export interface RestructuredHourlyForecast {
  day: 'sunny' | 'night';
  time: string;
  units?: HourlyUnit;
  temperature_2m: number;
  weathercode: number;
  relativehumidity_2m?: number;
  dewpoint_2m?: number;
  apparent_temperature?: number;
  cloudcover?: number;
  windspeed_10m?: number;
  winddirection_10m?: number;
  windgusts_10m?: number;
  surface_pressure?: number;
  direct_radiation?: number;
}

export interface LocationRes {
  results: SearchRes[];
}

export interface SearchRes {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  admin2_id?: number;
  timezone: string;
  population?: number;
  country_id: number;
  country: string;
  admin1: string;
  admin2?: string;
}

export interface RestructureSearchRes {
  location: SearchRes;
  current_weather: CurrentWeather;
}
