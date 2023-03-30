export interface MetaInterface extends Card {
  keywords: string;
}

export interface Card {
  title: string;
  description: string;
  img: string;
  path: string;
}

export interface Project {
  title: string;
  img: string;
  desc: string;
  areas: string[];
  link: { github: string; website?: string };
  background: string;
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

export interface DailyWeatherRes {
  time: string[];
  sunset: string[];
  sunrise: string[];
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
  hourly_units: HourlyUnit;
  hourly: HourlyForcast;
  daily: DailyWeatherRes;
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
}

export interface HourlyForcast {
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
}

export interface RestructuredHourlyForecast {
  day: 'sunny' | 'night';
  time: number;
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
}

export interface SearchRes {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface RestructureSearchRes {
  location: SearchRes;
  current_weather: CurrentWeather;
}
