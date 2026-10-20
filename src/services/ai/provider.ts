import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { AIUnifiedResponseSchema, AIUnifiedResponse } from './schema';
import { localArchitecturalEngine } from './localEngine';

export interface AIProvider {
  processCommand(prompt: string, context: any): Promise<AIUnifiedResponse>;
}

export class HybridAIProvider implements AIProvider {
  async processCommand(prompt: string, context: any): Promise<AIUnifiedResponse> {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // If an official Google AI Studio API key starting with AIzaSy is present, try Cloud Gemini
    if (apiKey && apiKey.startsWith('AIzaSy')) {
      try {
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

        const { object } = await generateObject({
          model: google('gemini-1.5-flash'),
          schema: AIUnifiedResponseSchema,
          system: systemPrompt,
          prompt: prompt,
        });

        if (object && object.message) {
          return object;
        }
      } catch (cloudErr) {
        console.warn("Cloud Gemini unreachable, delegating to Local Architectural Civil Engine:", cloudErr);
      }
    }

    // High-performance deterministic architectural intelligence engine
    return localArchitecturalEngine.processCommand(prompt, context);
  }
}

export function getAIProvider(): AIProvider {
  return new HybridAIProvider();
}
