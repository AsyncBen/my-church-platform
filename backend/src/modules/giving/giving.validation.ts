import { z } from 'zod';

export const createGivingSchema = z.object({
  category: z.enum([
    'TITHE',
    'OFFERING',
    'THANKSGIVING',
    'BUILDING_FUND',
    'MISSION_SUPPORT',
    'SPECIAL_SEED',
  ]),
  amount: z.number().positive(),
  reference: z.string().optional(),
  note: z.string().optional(),
  service: z.string().min(1),
});

export type CreateGivingInput = z.infer<typeof createGivingSchema>;
