import {z} from 'zod';
import {DEFAULT_VALIDATION_REQUIRED} from "~/common/constants/constantsMessages";

export const updateSpeciesNamesSchema = z.object({
  latinName: z
      .string({message: DEFAULT_VALIDATION_REQUIRED})
      .trim()
      .min(1, {message: DEFAULT_VALIDATION_REQUIRED}),
  commonNames: z
      .array(
          z.object({
            name: z.string().min(1, "Name is required"),
            lang: z.string().min(2, "Language code is required"),
          })
      )
})