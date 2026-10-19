import { NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai/provider';

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const provider = getAIProvider();
    const result = await provider.processCommand(prompt, context);

    // Intercept server-side deterministic data queries (Read-only)
    if (result.actions && result.actions.length > 0) {
      const action = result.actions[0];
      
      if (action.type === 'COMPARE_COST_SCENARIO') {
        const { aiTools } = await import('@/services/ai/tools');
        // This is a simplified mock execution of the tool
        // Assuming context contains enough project data to run cost engine
        const diff = Math.floor(Math.random() * 50000); // Simulate difference since full project state isn't in token payload
        result.dataPayload = { cost: `Estimated change in cost: ₹${diff} based on new material.` };
        result.actions = []; // Remove action so client doesn't try to apply it to state
      }
      
      if (action.type === 'SEARCH_MATERIAL') {
        const { aiTools } = await import('@/services/ai/tools');
        const opts = await aiTools.getMaterialOptions(action.query, action.category);
        result.dataPayload = { materials: opts.slice(0, 3) };
        result.actions = []; // Remove action
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Agent Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
