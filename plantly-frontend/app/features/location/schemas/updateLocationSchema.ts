import {z} from 'zod';
import {DEFAULT_VALIDATION_REQUIRED} from "~/common/constants/constantsMessages";

export const updateLocationSchema = z.object({
  locations: z
      .array(
          z.object({
            id: z.number(),
            name: z
                .string({message: DEFAULT_VALIDATION_REQUIRED})
                .trim()
                .min(1, {message: DEFAULT_VALIDATION_REQUIRED}),
            description: z
                .string({message: DEFAULT_VALIDATION_REQUIRED})
                .trim()
                .min(1, {message: DEFAULT_VALIDATION_REQUIRED}),
          })
      )
})