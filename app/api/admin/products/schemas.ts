import { z } from 'zod'

// Shared between the create (route.ts) and patch ([id]/route.ts) endpoints.
// Pack-size options and the photo gallery ride along on the same save payload.
export const variantsSchema = z
  .array(
    z.object({
      name: z.string().min(1).max(100),
      packSize: z.number().int().min(1),
      priceCents: z.number().int().positive(),
    })
  )
  .max(12)

export const imageIdsSchema = z.array(z.string()).max(12)
