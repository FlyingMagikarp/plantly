import { describe, expect, it } from 'vitest';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('reports that the application is healthy', () => {
    expect(new HealthService().getStatus()).toEqual({ status: 'ok' });
  });
});
