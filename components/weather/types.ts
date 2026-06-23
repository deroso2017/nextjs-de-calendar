type NowWeather = {
  temperature: number;
  windspeed: number;
  weathercode: number;
};

export type Hour = {
  time: string;
  temperature: number;
  weathercode: number;
};

type Day = {
  date: string;
  max: number;
  min: number;
  weathercode: number;
};

export type WeatherState = {
  name: string;
  country: string;
  now: NowWeather;
  hourly: Hour[];
  daily: Day[];
};
