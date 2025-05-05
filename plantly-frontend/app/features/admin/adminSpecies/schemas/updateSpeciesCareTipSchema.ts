import {number, string, z} from 'zod';
import {DEFAULT_VALIDATION_REQUIRED} from "~/common/constants/constantsMessages";

export const updateSpeciesCareTipSchema = z.object({
  id: z.string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  placement: z.enum(['sunny', 'semi_shade', 'shade'],{message: DEFAULT_VALIDATION_REQUIRED}),
  winterHardy: z.boolean({message: DEFAULT_VALIDATION_REQUIRED}).optional(),
  optimalTempMinC: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  optimalTempMaxC: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  wateringFrequencyDays: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  wateringNotes: z.string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  fertilizingFrequencyDays: number({message: DEFAULT_VALIDATION_REQUIRED}),
  fertilizingType: string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  fertilizingNotes: string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  repottingCycleMonths: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  growingSeasonStart: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  growingSeasonEnd: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  dormantSeasonStart: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  dormantSeasonEnd: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  pruningNotes: z.string().trim().optional(),
  pruningMonths: z
      .string()
      .transform((val) =>
          val
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s !== '')
              .map(Number)
              .filter((n) => !isNaN(n))
      ),
  wiringNotes: z.string().trim().optional(),
  wiringMonths: z
      .string()
      .transform((val) =>
          val
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s !== '')
              .map(Number)
              .filter((n) => !isNaN(n))
      ),
  propagationNotes: z.string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  propagationMonths: z
      .string()
      .transform((val) =>
          val
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s !== '')
              .map(Number)
              .filter((n) => !isNaN(n))
      ),
  pests: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  soil: z.string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
})