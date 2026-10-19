import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { AIUnifiedResponseSchema, AIUnifiedResponse } from './schema';

export interface AIProvider {
  processCommand(prompt: string, context: any): Promise<AIUnifiedResponse>;
}

export class GoogleAIProvider implements AIProvider {
  async processCommand(prompt: string, context: any): Promise<AIUnifiedResponse> {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("AI service is not configured.");
    }
    
    const systemPrompt = `You are an AI Civil Architecture & Interior Design Agent.
You modify a structured project JSON or query project state.
You MUST follow these rules:
1. Be concise.
2. Explain what changed.
3. NEVER invent data (prices, geometry, material specs).
4. Use the provided project context to form semantic actions (like MOVE_NEAR_WINDOW) or direct actions.
5. Do NOT do math calculations directly; use actions like RECALCULATE_COST.

Current Context:
${JSON.stringify(context, null, 2)}`;

    try {
      const { object } = await generateObject({
        model: google('gemini-2.5-pro'),
        schema: AIUnifiedResponseSchema,
        system: systemPrompt,
        prompt: prompt,
      });

      return object;
    } catch (e: any) {
      console.error("AI Generation Error:", e);
      throw new Error("Failed to interpret agent request.");
    }
  }
}

export function getAIProvider(): AIProvider {
  return new GoogleAIProvider();
}
