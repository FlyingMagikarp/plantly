import {z} from 'zod';

const eventTypeSchema = z.enum([
  'watering', 'fertilizing', 'pruning', 'repotting', 'wiring',
  'checking', 'acquired', 'removed', 'other'
]);

export const updateCareLogSchema = z.object({
  plantId: z.number(),
  eventDate: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          return new Date(val);
        } else if (val instanceof Date) {
          return val;
        }
        return undefined;
      },
      z.date().optional()
  ),
  eventType: eventTypeSchema,
  notes: z
      .string()
      .trim()
      .optional(),
})