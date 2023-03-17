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

export interface CurrentWeatherRes {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
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
  current_weather: CurrentWeatherRes;
  hourly_units: {
    time: string;
    temperature_2m: string;
    weathercode: string;
  };
  hourly: HourlyForcast;
  daily: DailyWeatherRes;
}

export interface HourlyForcast {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
}

export interface RestructuredHourlyForecast {
  time: number;
  temperature_2m: number;
  weathercode: number;
  day: 'sunny' | 'night';
}
