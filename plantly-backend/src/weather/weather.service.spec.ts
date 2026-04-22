import { WeatherService } from './weather.service';
import { WeatherSeverity } from './dto/weather-data.dto';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(() => {
    service = new WeatherService();
  });

  describe('generateMessages', () => {
    it('should generate red frost warning if min temp < 0', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(5),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.temperature_2m[10] = -1;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.RED,
        message: expect.stringContaining('Frost warning'),
      });
    });

    it('should generate yellow cold warning if min temp < 10 but >= 0', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(15),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.temperature_2m[10] = 5;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.YELLOW,
        message: expect.stringContaining('Cold warning'),
      });
    });

    it('should generate red heat warning if max temp > 30', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(20),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.temperature_2m[10] = 31;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.RED,
        message: expect.stringContaining('Heat warning'),
      });
    });

    it('should generate yellow warm warning if max temp > 25 but <= 30', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(20),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.temperature_2m[10] = 26;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.YELLOW,
        message: expect.stringContaining('Warm warning'),
      });
    });

    it('should generate red wind warning if wind > 40', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(20),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.wind_speed_10m[10] = 41;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.RED,
        message: expect.stringContaining('Strong wind warning'),
      });
    });

    it('should generate yellow wind warning if wind > 25 but <= 40', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(20),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.wind_speed_10m[10] = 26;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.YELLOW,
        message: expect.stringContaining('Wind warning'),
      });
    });

    it('should generate info message if precipitation > 1mm', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(20),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.precipitation[10] = 1.1;

      const messages = (service as any).generateMessages(hourly);
      expect(messages).toContainEqual({
        severity: WeatherSeverity.INFO,
        message: expect.stringContaining('Precipitation expected'),
      });
    });

    it('should sort messages: red -> yellow -> info', () => {
      const hourly = {
        temperature_2m: new Array(24).fill(20),
        wind_speed_10m: new Array(24).fill(10),
        precipitation: new Array(24).fill(0),
      };
      hourly.temperature_2m[0] = -1; // RED: Frost
      hourly.wind_speed_10m[1] = 30; // YELLOW: Wind
      hourly.precipitation[2] = 2; // INFO: Rain

      const messages = (service as any).generateMessages(hourly);
      expect(messages.length).toBe(3);
      expect(messages[0].severity).toBe(WeatherSeverity.RED);
      expect(messages[1].severity).toBe(WeatherSeverity.YELLOW);
      expect(messages[2].severity).toBe(WeatherSeverity.INFO);
    });

    it('should only use the first 24 hours', () => {
      const hourly = {
        temperature_2m: new Array(48).fill(20),
        wind_speed_10m: new Array(48).fill(10),
        precipitation: new Array(48).fill(0),
      };
      hourly.temperature_2m[25] = -1; // Frost at hour 25

      const messages = (service as any).generateMessages(hourly);
      expect(messages.length).toBe(0);
    });
  });
});
