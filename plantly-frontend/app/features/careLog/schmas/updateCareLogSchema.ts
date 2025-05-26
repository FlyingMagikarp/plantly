import {z} from 'zod';
import {DEFAULT_VALIDATION_REQUIRED} from "~/common/constants/constantsMessages";

export const updateCareLogSchema = z.object({
  id: z.number(),
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
  eventType: z
    .string({message: DEFAULT_VALIDATION_REQUIRED})
    .trim()
    .min(1, {message: DEFAULT_VALIDATION_REQUIRED}),
  notes: z
    .string()
    .trim()
    .optional(),
})