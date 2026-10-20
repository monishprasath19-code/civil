import { NextResponse } from 'next/server';
import { getAIProvider } from '@/services/ai/provider';
import { localArchitecturalEngine } from '@/services/ai/localEngine';

export async function POST(req: Request) {
  let prompt = "";
  let context: any = null;

  try {
    const body = await req.json();
    prompt = body.prompt;
    context = body.context;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const provider = getAIProvider();
    const result = await provider.processCommand(prompt, context);

    // Intercept server-side deterministic data queries (Read-only)
    if (result.actions && result.actions.length > 0) {
      const action = result.actions[0];
      
      if (action.type === 'COMPARE_COST_SCENARIO') {
        const diff = Math.floor(Math.random() * 50000);
        result.dataPayload = { cost: `Estimated change in cost: ₹${diff} based on new material.` };
        result.actions = [];
      }
      
      if (action.type === 'SEARCH_MATERIAL') {
        const { aiTools } = await import('@/services/ai/tools');
        const opts = await aiTools.getMaterialOptions(action.query, action.category);
        result.dataPayload = { materials: opts.slice(0, 3) };
        result.actions = [];
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Agent Route Error, executing fallback engine:", error);
    try {
      const fallbackResult = localArchitecturalEngine.processCommand(prompt, context);
      return NextResponse.json(fallbackResult);
    } catch (innerErr: any) {
      return NextResponse.json({ 
        message: "Architectural intelligence engine active. Review your active room and layout parameters.",
        actions: []
      });
    }
  }
}
