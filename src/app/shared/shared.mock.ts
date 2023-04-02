import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  CurrentWeatherRes,
  DailyWeatherForecast,
  FullHourlyRes,
  HourlyRes,
  HourlyUnit,
  IPRes,
  LocationRes,
  RestructuredCurrentDailyWeatherRes,
  RestructuredDailyForecast,
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
  direct_radiation: 'W/m²',
};

export const MockHoulyData: RestructuredHourlyForecast[] = [
  {
    day: 'sunny',
    time: '2023-03-18T13:00',

    temperature_2m: 31.7,
    weathercode: 2,
  },
  {
    day: 'sunny',
    time: '2023-03-18T13:00',

    temperature_2m: 31.7,
    weathercode: 2,
  },
  {
    day: 'sunny',
    time: '2023-03-18T13:00',

    temperature_2m: 31.7,
    weathercode: 2,
  },
];

export const MockFullHoulyData: RestructuredHourlyForecast[] = [
  {
    day: 'sunny',
    time: '2023-03-18T13:00',
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
    time: '2023-03-18T13:00',
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
    time: '2023-03-18T13:00',
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

export const locationResMock: LocationRes = {
  results: [
    {
      id: 2332459,
      name: 'Lagos',
      latitude: 6.5,
      longitude: 3.375,
      elevation: 11.0,
      feature_code: 'PPLA2',
      country_code: 'NG',
      admin1_id: 2332453,
      timezone: 'Africa/Lagos',
      population: 9000000,
      country_id: 2328926,
      country: 'Nigeria',
      admin1: 'Lagos',
    },
    {
      id: 3637721,
      name: 'La Guaira',
      latitude: 10.60156,
      longitude: -66.93293,
      elevation: 15.0,
      feature_code: 'PPLA',
      country_code: 'VE',
      admin1_id: 3830309,
      admin2_id: 8129268,
      timezone: 'America/Caracas',
      population: 25259,
      country_id: 3625428,
      country: 'Venezuela',
      admin1: 'Vargas',
      admin2: 'Municipio Vargas',
    },
    {
      id: 863634,
      name: 'Lag',
      latitude: 41.63431,
      longitude: 21.23142,
      elevation: 493.0,
      feature_code: 'PPL',
      country_code: 'MK',
      admin1_id: 863877,
      timezone: 'Europe/Skopje',
      country_id: 718075,
      country: 'North Macedonia',
      admin1: 'Makedonski Brod',
    },
    {
      id: 7438096,
      name: 'Lag',
      latitude: 8.06698,
      longitude: 28.09782,
      elevation: 433.0,
      feature_code: 'PPL',
      country_code: 'SS',
      admin1_id: 408670,
      timezone: 'Africa/Juba',
      country_id: 7909807,
      country: 'South Sudan',
      admin1: 'Warrap',
    },
    {
      id: 10717975,
      name: 'Lag',
      latitude: 32.29443,
      longitude: 76.21994,
      elevation: 1847.0,
      feature_code: 'PPL',
      country_code: 'IN',
      admin1_id: 1270101,
      timezone: 'Asia/Kolkata',
      country_id: 1269750,
      country: 'India',
      admin1: 'Himachal Pradesh',
    },
  ],
};

export const restructured_current_weather_mock: CurrentWeatherRes = {
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

export const restructuredLocationMock: SearchRes = {
  id: 2332459,
  name: 'Lagos',
  latitude: 6.5,
  longitude: 3.375,
  elevation: 11.0,
  feature_code: 'PPLA2',
  country_code: 'NG',
  admin1_id: 2332453,
  timezone: 'Africa/Lagos',
  population: 9000000,
  country_id: 2328926,
  country: 'Nigeria',
  admin1: 'Lagos',
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

export const hourlyRes: HourlyRes = {
  latitude: 6.5,
  longitude: 3.375,
  generationtime_ms: 1.1320114135742188,
  utc_offset_seconds: 3600,
  timezone: 'Africa/Lagos',
  timezone_abbreviation: 'WAT',
  elevation: 0.0,
  current_weather: {
    temperature: 31.7,
    windspeed: 12.6,
    winddirection: 204.0,
    weathercode: 2,
    time: '2023-03-18T11:00',
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
      '2023-03-18T00:00',
      '2023-03-18T01:00',
      '2023-03-18T02:00',
      '2023-03-18T03:00',
      '2023-03-18T04:00',
      '2023-03-18T05:00',
      '2023-03-18T06:00',
      '2023-03-18T07:00',
      '2023-03-18T08:00',
      '2023-03-18T09:00',
      '2023-03-18T10:00',
      '2023-03-18T11:00',
      '2023-03-18T12:00',
      '2023-03-18T13:00',
      '2023-03-18T14:00',
      '2023-03-18T15:00',
      '2023-03-18T16:00',
      '2023-03-18T17:00',
      '2023-03-18T18:00',
      '2023-03-18T19:00',
      '2023-03-18T20:00',
      '2023-03-18T21:00',
      '2023-03-18T22:00',
      '2023-03-18T23:00',
    ],
    weathercode: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
  },
};

export const fullHourlyRes: FullHourlyRes = {
  latitude: 6.5,
  longitude: 3.375,
  generationtime_ms: 1.1320114135742188,
  utc_offset_seconds: 3600,
  timezone: 'Africa/Lagos',
  timezone_abbreviation: 'WAT',
  elevation: 0.0,
  current_weather: {
    temperature: 31.7,
    windspeed: 12.6,
    winddirection: 204.0,
    weathercode: 2,
    time: '2023-03-18T13:00',
  },
  hourly_units: {
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
    direct_radiation: 'W/m²',
  },
  hourly: {
    temperature_2m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    time: [
      '2023-03-18T00:00',
      '2023-03-18T01:00',
      '2023-03-18T02:00',
      '2023-03-18T03:00',
      '2023-03-18T04:00',
      '2023-03-18T05:00',
      '2023-03-18T06:00',
      '2023-03-18T07:00',
      '2023-03-18T08:00',
      '2023-03-18T09:00',
      '2023-03-18T10:00',
      '2023-03-18T11:00',
      '2023-03-18T12:00',
      '2023-03-18T13:00',
      '2023-03-18T14:00',
      '2023-03-18T15:00',
      '2023-03-18T16:00',
      '2023-03-18T17:00',
      '2023-03-18T18:00',
      '2023-03-18T19:00',
      '2023-03-18T20:00',
      '2023-03-18T21:00',
      '2023-03-18T22:00',
      '2023-03-18T23:00',
    ],
    weathercode: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    apparent_temperature: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    cloudcover: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    dewpoint_2m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    relativehumidity_2m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    surface_pressure: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    winddirection_10m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    windgusts_10m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    windspeed_10m: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    direct_radiation: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
  },
  daily: {
    time: [
      '2023-03-30',
      '2023-03-31',
      '2023-04-01',
      '2023-04-02',
      '2023-04-03',
      '2023-04-04',
      '2023-04-05',
      '2023-04-06',
    ],
    sunset: [
      '2023-03-30T18:57',
      '2023-03-31T18:57',
      '2023-04-01T18:56',
      '2023-04-02T18:56',
      '2023-04-03T18:56',
      '2023-04-04T18:56',
      '2023-04-05T18:56',
      '2023-04-06T18:56',
    ],
    sunrise: [
      '2023-03-30T06:44',
      '2023-03-31T06:44',
      '2023-04-01T06:43',
      '2023-04-02T06:43',
      '2023-04-03T06:42',
      '2023-04-04T06:42',
      '2023-04-05T06:42',
      '2023-04-06T06:41',
    ],
  },
};

export const mockDailyRes: DailyWeatherForecast = {
  latitude: 6.5,
  longitude: 3.375,
  generationtime_ms: 2.322077751159668,
  utc_offset_seconds: 3600,
  timezone: 'Africa/Lagos',
  timezone_abbreviation: 'WAT',
  elevation: 7.0,
  daily_units: {
    time: 'iso8601',
    weathercode: 'wmo code',
    sunrise: 'iso8601',
    sunset: 'iso8601',
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    windspeed_10m_max: 'km/h',
    windgusts_10m_max: 'km/h',
    apparent_temperature_min: '°C',
    apparent_temperature_max: '°C',
    winddirection_10m_dominant: '°',
    shortwave_radiation_sum: 'MJ/m²',
  },
  daily: {
    time: [
      '2023-04-01',
      '2023-04-02',
      '2023-04-03',
      '2023-04-04',
      '2023-04-05',
      '2023-04-06',
      '2023-04-07',
      '2023-04-08',
      '2023-04-09',
      '2023-04-10',
      '2023-04-11',
      '2023-04-12',
      '2023-04-13',
      '2023-04-14',
      '2023-04-15',
      '2023-04-16',
    ],
    weathercode: [3, 80, 95, 80, 2, 80, 80, 80, 96, 96, 96, 96, 96, 95, 96, 96],
    sunrise: [
      '2023-04-01T06:43',
      '2023-04-02T06:43',
      '2023-04-03T06:42',
      '2023-04-04T06:42',
      '2023-04-05T06:42',
      '2023-04-06T06:41',
      '2023-04-07T06:41',
      '2023-04-08T06:40',
      '2023-04-09T06:40',
      '2023-04-10T06:39',
      '2023-04-11T06:39',
      '2023-04-12T06:38',
      '2023-04-13T06:38',
      '2023-04-14T06:38',
      '2023-04-15T06:37',
      '2023-04-16T06:37',
    ],
    sunset: [
      '2023-04-01T18:56',
      '2023-04-02T18:56',
      '2023-04-03T18:56',
      '2023-04-04T18:56',
      '2023-04-05T18:56',
      '2023-04-06T18:56',
      '2023-04-07T18:56',
      '2023-04-08T18:56',
      '2023-04-09T18:56',
      '2023-04-10T18:55',
      '2023-04-11T18:55',
      '2023-04-12T18:55',
      '2023-04-13T18:55',
      '2023-04-14T18:55',
      '2023-04-15T18:55',
      '2023-04-16T18:55',
    ],
    temperature_2m_max: [
      32.2, 32.2, 31.1, 32.1, 32.6, 33.0, 32.8, 32.7, 33.1, 32.6, 32.7, 32.6,
      32.3, 33.0, 32.5, 28.9,
    ],
    temperature_2m_min: [
      28.3, 28.1, 28.2, 28.0, 28.2, 28.6, 28.3, 27.6, 28.0, 28.1, 28.0, 27.8,
      27.8, 27.6, 27.7, 27.0,
    ],
    windspeed_10m_max: [
      11.7, 10.6, 8.4, 10.9, 10.9, 11.0, 12.7, 12.2, 21.1, 24.2, 21.5, 23.8,
      21.4, 20.2, 19.9, 20.0,
    ],
    windgusts_10m_max: [
      29.2, 26.6, 23.4, 27.0, 28.4, 27.0, 31.7, 29.5, 29.9, 24.8, 28.8, 29.5,
      24.1, 25.6, 23.4, 27.7,
    ],
    apparent_temperature_min: [
      34.1, 34.2, 34.2, 34.0, 34.4, 34.7, 34.1, 33.8, 32.1, 32.6, 32.7, 31.9,
      32.9, 32.9, 33.0, 31.0,
    ],
    apparent_temperature_max: [
      38.2, 39.1, 36.8, 38.6, 38.5, 38.9, 38.9, 38.3, 37.0, 36.4, 36.4, 36.2,
      35.7, 37.2, 36.5, 34.7,
    ],
    winddirection_10m_dominant: [
      206, 200, 207, 202, 204, 213, 223, 230, 223, 220, 219, 222, 215, 210, 222,
      235,
    ],
    shortwave_radiation_sum: [
      206, 200, 207, 202, 204, 213, 223, 230, 223, 220, 219, 222, 215, 210, 222,
      235,
    ],
  },
};

export const mockCurrentDailyWeatherRes = {
  latitude: 6.75,
  longitude: 3.375,
  generationtime_ms: 0.6389617919921875,
  utc_offset_seconds: 3600,
  timezone: 'Africa/Lagos',
  timezone_abbreviation: 'WAT',
  elevation: 7.0,
  current_weather: {
    temperature: 28.2,
    windspeed: 5.9,
    winddirection: 194.0,
    weathercode: 0,
    time: '2023-04-02T21:00',
  },
  daily_units: {
    time: 'iso8601',
    sunset: 'iso8601',
    sunrise: 'iso8601',
  },
  daily: {
    time: ['2023-04-02'],
    sunset: ['2023-04-02T18:56'],
    sunrise: ['2023-04-02T06:43'],
  },
};

export const restructuredCurrentDailyWeatherRes: RestructuredCurrentDailyWeatherRes =
  {
    current_weather: mockCurrentDailyWeatherRes.current_weather,
    daily: {
      time: mockCurrentDailyWeatherRes.daily.time[0],
      sunrise: mockCurrentDailyWeatherRes.daily.sunrise[0],
      sunset: mockCurrentDailyWeatherRes.daily.sunset[0],
    },
  };

export let generateRestructuredForecast = (
  current: number,
  limit: number
): RestructuredHourlyForecast[] => {
  let forecast: RestructuredHourlyForecast[] = [];

  for (let i: number = current; i < current + limit; i++) {
    forecast.push({
      time: `2023-03-18T${i}:00`,
      day: 'sunny',
      temperature_2m: i,
      weathercode: i,
    });
  }

  return forecast;
};

export let generateFullRestructuredForecast = (
  current: number
): RestructuredHourlyForecast[] => {
  let forecast: RestructuredHourlyForecast[] = [];

  for (let i: number = current; i < 24; i++) {
    forecast.push({
      time: `2023-03-18T${i}:00`,
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
      direct_radiation: i,
    });
  }

  return forecast;
};

export let generateDailyRestructuredForecast =
  (): RestructuredDailyForecast[] => {
    let forecast: RestructuredDailyForecast[] = [];

    for (let i: number = 0; i < 16; i++) {
      forecast.push({
        time: mockDailyRes.daily.time[i],
        units: mockDailyRes.daily_units,
        weathercode: mockDailyRes.daily.weathercode[i],
        sunrise: mockDailyRes.daily.sunrise[i],
        sunset: mockDailyRes.daily.sunset[i],
        temperature_2m_min: mockDailyRes.daily.temperature_2m_min[i],
        temperature_2m_max: mockDailyRes.daily.temperature_2m_max[i],
        windspeed_10m_max: mockDailyRes.daily.windspeed_10m_max[i],
        windgusts_10m_max: mockDailyRes.daily.windgusts_10m_max[i],
        apparent_temperature_min:
          mockDailyRes.daily.apparent_temperature_min[i],
        apparent_temperature_max:
          mockDailyRes.daily.apparent_temperature_max[i],
        winddirection_10m_dominant:
          mockDailyRes.daily.winddirection_10m_dominant[i],
        shortwave_radiation_sum: mockDailyRes.daily.shortwave_radiation_sum[i],
      });
    }

    return forecast;
  };
