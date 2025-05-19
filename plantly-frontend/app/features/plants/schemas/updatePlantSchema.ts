import {z} from "zod";
import {DEFAULT_VALIDATION_REQUIRED} from "~/common/constants/constantsMessages";


export const updatePlantSchema = z.object({
  id: z.string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  speciesId: z.number({message: DEFAULT_VALIDATION_REQUIRED}).min(0),
  nickname: z.string().trim().optional(),
  acquiredAt: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
  locationId: z.number({message: DEFAULT_VALIDATION_REQUIRED}),
  notes: z.string().trim().optional(),
  removed: z.boolean(),
  died: z.boolean(),
  inactiveReason: z.string().trim().optional(),
  inactiveDate: z.preprocess((val) => val ? new Date(val as string) : undefined, z.date().optional()),
  checkFreq: z.number(),
});