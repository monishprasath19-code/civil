# AI Civil Agent

An advanced, AI-powered workspace for planning, designing, visualizing, and estimating construction projects from plot to completion. 

## Features

- **Project Management:** Track requirements, budgets, and site specifics.
- **2D Floor Planner:** Draw walls, rooms, doors, and layout interactive furniture on a realistic grid.
- **3D Visualization:** Instantly explore your 2D plans in a 3D perspective with Orbit, Top, Front, and First-Person Walkthrough modes.
- **Materials Intelligence:** Assign PBR materials to rooms, walls, roofs, and exteriors.
- **Exterior & Site Design:** Configure driveway, parking, compound walls, gates, and trees. Time-of-day lighting simulation.
- **Deterministic Cost Estimation & BOQ:** Automatically generate a Bill of Quantities and preliminary cost estimate based on actual 2D/3D geometry.
- **Unified AI Orchestrator:** Chat with an intelligent agent to layout furniture, modify materials, query budgets, and execute cost scenarios. All AI actions pass through a deterministic validation layer.
- **Project Reports:** Export CSV BOQs and generate professional project summaries covering health, errors, assumptions, and cost layouts.

## Architecture

* **Frontend:** Next.js (App Router), React 19, Tailwind CSS.
* **2D Engine:** React-Konva (Canvas).
* **3D Engine:** Three.js, React Three Fiber, Drei.
* **State Management:** Zustand (with atomic grouped undo/redo).
* **Database & Auth:** Supabase (PostgreSQL with RLS).
* **AI Provider:** Vercel AI SDK integrating Google Gemini.
* **Validation:** Zod.

## Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` is required due to React 19 and Drei peer dependency mismatches).*

2. **Environment Variables:**
   Copy `.env.local.example` to `.env.local` and populate:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

3. **Supabase Setup:**
   Run the SQL migration found in `supabase/migrations/20260101000000_init.sql` on your Supabase instance to create the `profiles`, `projects`, and `project_versions` tables with their respective Row Level Security (RLS) policies.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Build and Deployment

To create an optimized production build:
```bash
npm run build
npm run start
```
This project is deployment-ready for Vercel. Ensure environment variables are configured securely in your deployment dashboard.

## Important Limitations & Disclaimers
* **Preliminary Estimates:** All cost estimations, BOQs, and generated structural layouts are strictly for planning purposes. They do not substitute certified structural engineering plans or local code compliance.
* **Cost Rates:** Base material and labour rates are loaded from a static mock dataset. For production usage, this should be hooked up to a live pricing API or enterprise CSV database.
* **Asset Loading:** `.glb` 3D assets are loaded asynchronously. If an asset fails to download, the application degrades gracefully to primitive bounding boxes via `ModelErrorBoundary`.
