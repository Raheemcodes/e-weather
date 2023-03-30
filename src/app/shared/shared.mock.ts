import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  CurrentWeatherRes,
  HourlyRes,
  HourlyUnit,
  IPRes,
  RestructuredHourlyForecast,
  SearchRes,
} from './shared.model';

export const ipDataMock = {
  city: 'Lagos',
  latitude: 6.54,
  longitude: 3.39,
} as IPRes;

export const hourlyUnitMock: HourlyUnit = {
  time: 'iso8601',
  temperature_2m: '°C',
  weathercode: 'wmo code',
  relativehumidity_2m: '%',
  dewpoint_2m: '°C',
  apparent_temperature: '°C',
  cloudcover: '%',
  windspeed_10m: 'km/h',
  winddirection_10m: '°',
  windgusts_10m: 'km/h',
  surface_pressure: 'hPa',
};

export const MockHoulyData: RestructuredHourlyForecast[] = [
  {
    day: 'sunny',
    time: 13,

    temperature_2m: 31.7,
    weathercode: 2,
  },
  {
    day: 'sunny',
    time: 13,

    temperature_2m: 31.7,
    weathercode: 2,
  },
  {
    day: 'sunny',
    time: 13,

    temperature_2m: 31.7,
    weathercode: 2,
  },
];
export const MockFullHoulyData: RestructuredHourlyForecast[] = [
  {
    day: 'sunny',
    time: 13,
    units: hourlyUnitMock,
    temperature_2m: 31.7,
    weathercode: 2,
    relativehumidity_2m: 67,
    dewpoint_2m: 24.7,
    apparent_temperature: 37.7,
    cloudcover: 53,
    windspeed_10m: 12.6,
    winddirection_10m: 204,
    windgusts_10m: 30.2,
    surface_pressure: 1011.1,
  },
  {
    day: 'sunny',
    time: 13,
    units: hourlyUnitMock,
    temperature_2m: 31.7,
    weathercode: 2,
    relativehumidity_2m: 67,
    dewpoint_2m: 24.7,
    apparent_temperature: 37.7,
    cloudcover: 53,
    windspeed_10m: 12.6,
    winddirection_10m: 204,
    windgusts_10m: 30.2,
    surface_pressure: 1011.1,
  },
  {
    day: 'sunny',
    time: 13,
    units: hourlyUnitMock,
    temperature_2m: 31.7,
    weathercode: 2,
    relativehumidity_2m: 67,
    dewpoint_2m: 24.7,
    apparent_temperature: 37.7,
    cloudcover: 53,
    windspeed_10m: 12.6,
    winddirection_10m: 204,
    windgusts_10m: 30.2,
    surface_pressure: 1011.1,
  },
];

export const current_weather_mock: CurrentWeatherRes = {
  elevation: 5,
  generationtime_ms: 0.5630254745483398,
  latitude: 6.5,
  longitude: 3.375,
  timezone: 'Africa/Lagos',
  timezone_abbreviation: 'WAT',
  utc_offset_seconds: 3600,
  current_weather: {
    temperature: 30.4,
    weathercode: 80,
    winddirection: 197,
    windspeed: 9.8,
    time: '2023-03-18T13:00',
  },
};

export const locationResMock: SearchRes[] = [
  {
    id: 1734598,
    name: 'Lagos',
    region: 'Lagos',
    country: 'Nigeria',
    lat: 6.5,
    lon: 3.375,
    url: 'lagos-lagos-nigeria',
  },
  {
    id: 3256200,
    name: 'Lagos De Moreno',
    region: 'Jalisco',
    country: 'Mexico',
    lat: 21.36,
    lon: -101.93,
    url: 'lagos-de-moreno-jalisco-mexico',
  },
  {
    id: 2003368,
    name: 'Lagos',
    region: 'Faro',
    country: 'Portugal',
    lat: 37.1,
    lon: -8.67,
    url: 'lagos-faro-portugal',
  },
  {
    id: 784036,
    name: 'Lagos',
    region: 'Aquitaine',
    country: 'France',
    lat: 43.22,
    lon: -0.22,
    url: 'lagos-aquitaine-france',
  },
  {
    id: 3246691,
    name: 'Lagos Del Sol',
    region: 'Quintana Roo',
    country: 'Mexico',
    lat: 21.05,
    lon: -86.85,
    url: 'lagos-del-sol-quintana-roo-mexico',
  },
];

export const restructured_current_weather_mock = {
  elevation: 5,
  generationtime_ms: 0.5630254745483398,
  latitude: 6.5,
  longitude: 3.375,
  timezone: 'Africa/Lagos',
  timezone_abbreviation: 'WAT',
  utc_offset_seconds: 3600,
  current_weather: {
    temperature: 30.4,
    weathercode: 80,
    winddirection: 197,
    windspeed: 9.8,
    time: '1:00 PM',
  },
};

export const restructuredLocationMock = {
  id: 1734598,
  name: 'Lagos',
  region: 'Lagos',
  country: 'Nigeria',
  lat: 6.5,
  lon: 3.375,
  url: 'lagos-lagos-nigeria',
};

export const restructuredSearchResMock = [
  {
    current_weather: restructured_current_weather_mock.current_weather,
    location: restructuredLocationMock,
  },
];

export let httpClientMock: HttpClient = {
  get: (url: string) => of(),
} as any as HttpClient;

export const hourlyRes = {
  current_weather: {
    temperature: 32.4,
    time: '2023-03-17T11:00',
    weathercode: 2,
    winddirection: 187,
    windspeed: 8.4,
  },

  daily: {
    time: [
      '2023-03-18',
      '2023-03-19',
      '2023-03-20',
      '2023-03-21',
      '2023-03-22',
      '2023-03-23',
      '2023-03-24',
      '2023-03-25',
    ],
    sunset: [
      '2023-03-18T19:14',
      '2023-03-19T19:15',
      '2023-03-20T19:16',
      '2023-03-21T19:17',
      '2023-03-22T19:18',
      '2023-03-23T19:19',
      '2023-03-24T19:20',
      '2023-03-25T19:21',
    ],
    sunrise: [
      '2023-03-18T07:09',
      '2023-03-19T07:08',
      '2023-03-20T07:06',
      '2023-03-21T07:04',
      '2023-03-22T07:03',
      '2023-03-23T07:01',
      '2023-03-24T06:59',
      '2023-03-25T06:58',
    ],
  },

  hourly: {
    temperature_2m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    time: [
      '2023-03-17T00:00',
      '2023-03-17T01:00',
      '2023-03-17T02:00',
      '2023-03-17T03:00',
      '2023-03-17T04:00',
      '2023-03-17T05:00',
      '2023-03-17T06:00',
      '2023-03-17T07:00',
      '2023-03-17T08:00',
      '2023-03-17T09:00',
      '2023-03-17T10:00',
      '2023-03-17T11:00',
      '2023-03-17T12:00',
      '2023-03-17T13:00',
      '2023-03-17T14:00',
      '2023-03-17T15:00',
      '2023-03-17T16:00',
      '2023-03-17T17:00',
      '2023-03-17T18:00',
      '2023-03-17T19:00',
      '2023-03-17T20:00',
      '2023-03-17T21:00',
      '2023-03-17T22:00',
      '2023-03-17T23:00',
    ],
    weathercode: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
  },
} as HourlyRes;

export let generateRestructuredForecast = (
  current: number,
  limit: number
): RestructuredHourlyForecast[] => {
  let forecast: RestructuredHourlyForecast[] = [];

  for (let i: number = current; i < current + limit; i++) {
    forecast.push({
      time: i,
      day: 'night',
      temperature_2m: i,
      weathercode: i,
    });
  }

  return forecast;
};

export let generateFullRestructuredForecast = (
  current: number,
  limit: number
): RestructuredHourlyForecast[] => {
  let forecast: RestructuredHourlyForecast[] = [];

  for (let i: number = current; i < current + limit; i++) {
    forecast.push({
      time: i,
      day: 'night',
      units: hourlyUnitMock,
      temperature_2m: i,
      weathercode: i,
      relativehumidity_2m: i,
      dewpoint_2m: i,
      apparent_temperature: i,
      cloudcover: i,
      windspeed_10m: i,
      winddirection_10m: i,
      windgusts_10m: i,
      surface_pressure: i,
    });
  }

  return forecast;
};
