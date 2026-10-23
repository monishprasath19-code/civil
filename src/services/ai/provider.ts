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

    // If an official Google AI Studio API key starting with AIzaSy is present, try Cloud Gemini with 4s timeout
    if (apiKey && apiKey.startsWith('AIzaSy') && apiKey.length > 20) {
      try {
        const systemPrompt = `You are an expert AI Civil Architecture & Interior Design Agent.
You answer civil engineering questions, calculate structural quantities, or modify structured project JSON.
Rules:
1. Be concise, highly professional, and informative.
2. If explaining structural concepts, provide actionable civil engineering standards (NBC/IS/IBC).
3. If modifying project, use semantic actions.

Current Context:
${JSON.stringify(context || {}, null, 2)}`;

        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Cloud Gemini timed out")), 4000)
        );

        const geminiPromise = generateObject({
          model: google('gemini-1.5-flash'),
          schema: AIUnifiedResponseSchema,
          system: systemPrompt,
          prompt: prompt,
        });

        const { object } = await Promise.race([geminiPromise, timeoutPromise]);

        if (object && object.message) {
          return object;
        }
      } catch (cloudErr) {
        console.warn("Cloud Gemini fallback to Local Civil Architectural Intelligence Core:", cloudErr);
      }
    }

    // High-performance deterministic architectural intelligence engine
    return localArchitecturalEngine.processCommand(prompt, context);
  }
}

export function getAIProvider(): AIProvider {
  return new HybridAIProvider();
}
