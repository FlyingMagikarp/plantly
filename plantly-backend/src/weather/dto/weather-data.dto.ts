export enum WeatherSeverity {
  RED = 'red',
  YELLOW = 'yellow',
  INFO = 'info',
}

export class WeatherMessageDto {
  severity!: WeatherSeverity;
  message!: string;
}

export class ForecastDayDto {
  date!: string;
  minTemp!: number;
  maxTemp!: number;
  precipitation!: number;
  weatherCode!: number;
}

export class WeatherDataDto {
  current: {
    temp: number;
    windSpeed: number;
    precipitation: number;
    weatherCode: number;
  };
  forecast: ForecastDayDto[];
  messages: WeatherMessageDto[];
}
