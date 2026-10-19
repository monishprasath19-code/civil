import { z } from 'zod';

export const SemanticPositionSchema = z.union([
  z.object({ x: z.number(), y: z.number() }),
  z.object({ semantic: z.enum(['NEAR_WINDOW', 'NEAR_DOOR', 'CENTER', 'AGAINST_WALL', 'NEXT_TO_OBJECT']), referenceId: z.string().optional() })
]);

export const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const UnifiedActionSchema = z.discriminatedUnion("type", [
  // PROJECT
  z.object({ type: z.literal("UPDATE_BUDGET"), constructionBudget: z.number().optional(), interiorBudget: z.number().optional() }),
  // ROOM
  z.object({ type: z.literal("RESIZE_ROOM"), roomId: z.string(), dimensions: DimensionsSchema }),
  // FURNITURE
  z.object({ type: z.literal("ADD_FURNITURE"), assetId: z.string(), roomId: z.string().optional(), position: SemanticPositionSchema, rotation: z.number().optional() }),
  z.object({ type: z.literal("MOVE_FURNITURE"), furnitureId: z.string(), targetPosition: SemanticPositionSchema }),
  z.object({ type: z.literal("DELETE_FURNITURE"), furnitureId: z.string() }),
  // MATERIALS
  z.object({ type: z.literal("APPLY_MATERIAL"), targetType: z.enum(['room', 'wall', 'furniture', 'exterior']), targetId: z.string(), materialId: z.string() }),
  z.object({ type: z.literal("SEARCH_MATERIAL"), query: z.string(), style: z.string().optional(), category: z.string().optional() }),
  // EXTERIOR
  z.object({ type: z.literal("ADD_TREE"), position: SemanticPositionSchema }),
  z.object({ type: z.literal("CHANGE_ROOF"), roofType: z.enum(['flat', 'sloped']) }),
  z.object({ type: z.literal("CHANGE_TIME_OF_DAY"), timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']) }),
  // COST
  z.object({ type: z.literal("RECALCULATE_COST") }),
  z.object({ type: z.literal("COMPARE_COST_SCENARIO"), overrideMaterialId: z.string(), targetCategory: z.string() }),
  z.object({ type: z.literal("GENERATE_BOQ") }),
]);

export type UnifiedAction = z.infer<typeof UnifiedActionSchema>;

export const AIUnifiedResponseSchema = z.object({
  message: z.string().describe("Concise explanation of the changes, assumptions, uncertainty, or missing data. Never invent facts."),
  actions: z.array(UnifiedActionSchema).optional().describe("Sequential deterministic actions to execute."),
  needsClarification: z.boolean().optional(),
  dataPayload: z.any().optional().describe("Used for returning cost breakdowns, summaries, or read-only answers."),
});

export type AIUnifiedResponse = z.infer<typeof AIUnifiedResponseSchema>;
