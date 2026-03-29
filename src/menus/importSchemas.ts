import { z } from "zod";

export const campaignJsonSchema = z.object({
    name: z.string(),
});

export const campaignEntitySchema = z.object({
    name: z.string(),
    entity: z.object({
        type_id: z.number()
    }),
});

export const characterSchema = campaignEntitySchema.extend({
    title: z.string().optional().nullable(),
});
