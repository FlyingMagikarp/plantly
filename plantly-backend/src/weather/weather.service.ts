import { Injectable, Logger } from '@nestjs/common';
import {
  WeatherDataDto,
  WeatherMessageDto,
  WeatherSeverity,
  ForecastDayDto,
} from './dto/weather-data.dto';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  private readonly defaultLat = 46.95;
  private readonly defaultLon = 7.48;

  async getWeatherData(): Promise<WeatherDataDto | undefined> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.defaultLat}&longitude=${this.defaultLon}&current=temperature_2m,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        current: {
          temperature_2m: number;
          wind_speed_10m: number;
          precipitation: number;
          weather_code: number;
        };
        daily: {
          time: string[];
          temperature_2m_min: number[];
          temperature_2m_max: number[];
          precipitation_sum: number[];
          weather_code: number[];
        };
        hourly: {
          temperature_2m: number[];
          wind_speed_10m: number[];
          precipitation: number[];
        };
      };

      const current = {
        temp: data.current.temperature_2m,
        windSpeed: data.current.wind_speed_10m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
      };

      const forecast: ForecastDayDto[] = data.daily.time.map(
        (date: string, index: number) => ({
          date,
          minTemp: data.daily.temperature_2m_min[index],
          maxTemp: data.daily.temperature_2m_max[index],
          precipitation: data.daily.precipitation_sum[index],
          weatherCode: data.daily.weather_code[index],
        }),
      );

      const messages = this.generateMessages(data.hourly);

      return {
        current,
        forecast,
        messages,
      };
    } catch (error) {
      this.logger.error('Failed to fetch weather data', error);
      return undefined;
    }
  }

  private generateMessages(hourly: {
    temperature_2m: number[];
    wind_speed_10m: number[];
    precipitation: number[];
  }): WeatherMessageDto[] {
    const messages: WeatherMessageDto[] = [];

    // Next 24 hours only
    const next24hTemp = hourly.temperature_2m.slice(0, 24);
    const next24hWind = hourly.wind_speed_10m.slice(0, 24);
    const next24hPrecipitation = hourly.precipitation.slice(0, 24);

    const minTemp = Math.min(...next24hTemp);
    const maxTemp = Math.max(...next24hTemp);
    const maxWind = Math.max(...next24hWind);
    const totalPrecipitation = next24hPrecipitation.reduce(
      (a: number, b: number) => a + b,
      0,
    );

    // Temperature rules
    if (minTemp < 0) {
      messages.push({
        severity: WeatherSeverity.RED,
        message: `Frost warning: Minimum temperature of ${minTemp.toFixed(1)}°C expected.`,
      });
    } else if (minTemp < 10) {
      messages.push({
        severity: WeatherSeverity.YELLOW,
        message: `Cold warning: Minimum temperature of ${minTemp.toFixed(1)}°C expected.`,
      });
    }

    if (maxTemp > 30) {
      messages.push({
        severity: WeatherSeverity.RED,
        message: `Heat warning: Maximum temperature of ${maxTemp.toFixed(1)}°C expected.`,
      });
    } else if (maxTemp > 25) {
      messages.push({
        severity: WeatherSeverity.YELLOW,
        message: `Warm warning: Maximum temperature of ${maxTemp.toFixed(1)}°C expected.`,
      });
    }

    // Wind rules
    if (maxWind > 40) {
      messages.push({
        severity: WeatherSeverity.RED,
        message: `Strong wind warning: Max wind speed of ${maxWind.toFixed(1)} km/h expected.`,
      });
    } else if (maxWind > 25) {
      messages.push({
        severity: WeatherSeverity.YELLOW,
        message: `Wind warning: Max wind speed of ${maxWind.toFixed(1)} km/h expected.`,
      });
    }

    // Rain rules
    if (totalPrecipitation > 1) {
      messages.push({
        severity: WeatherSeverity.INFO,
        message: `Precipitation expected: ${totalPrecipitation.toFixed(1)} mm in the next 24h.`,
      });
    }

    // Sorting: RED -> YELLOW -> INFO
    const severityOrder = {
      [WeatherSeverity.RED]: 0,
      [WeatherSeverity.YELLOW]: 1,
      [WeatherSeverity.INFO]: 2,
    };

    return messages.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
    );
  }
}
