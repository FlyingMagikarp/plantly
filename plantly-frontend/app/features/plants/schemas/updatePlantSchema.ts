import {z} from "zod";
import {DEFAULT_VALIDATION_REQUIRED} from "~/common/constants/constantsMessages";


export const updatePlantSchema = z.object({
  id: z.string({message: DEFAULT_VALIDATION_REQUIRED}).trim(),
  speciesId: z.number({message: DEFAULT_VALIDATION_REQUIRED}).min(0),
  nickname: z.string().trim().optional(),
  acquiredAt: z.preprocess(
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
  locationId: z.number({message: DEFAULT_VALIDATION_REQUIRED}).min(0),
  notes: z.string().trim().optional(),
  removed: z.boolean().optional(),
  died: z.boolean().optional(),
  inactiveReason: z.string().trim().optional(),
  inactiveDate: z.preprocess(
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
  checkFreq: z.number(),
});