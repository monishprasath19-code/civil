import { createClient } from '@/utils/supabase/server';
import { SiteInfo, Budget, Requirements, FloorData, Material, ProjectState } from '@/models/project';

export function toProjectState(data: any): ProjectState & {
  site_data: SiteInfo;
  budget_data: Budget;
  requirements_data: Requirements;
  floors_data: FloorData[];
  materials_data: Material[];
  cost_estimate?: any;
} {
  const site: SiteInfo = data.site || data.site_data || {
    projectName: data.name || 'Untitled Project',
    location: '',
    plotLength: 20,
    plotWidth: 15,
    plotArea: 300,
    unit: 'meters',
    roadDirection: 'N',
    northDirection: 0,
    numberOfFloors: 1,
    terrain: 'flat',
    climate: 'tropical'
  };

  const budget: Budget = data.budget || data.budget_data || {
    totalBudget: 0,
    constructionBudget: 0,
    interiorBudget: 0,
    exteriorBudget: 0,
    furnitureBudget: 0
  };

  const requirements: Requirements = data.requirements || data.requirements_data || {
    type: 'Custom',
    rooms: {}
  };

  const floors: FloorData[] = data.floors || data.floors_data || [];
  const materials: Material[] = data.materials || data.materials_data || [];
  const costEstimate = data.costEstimate || data.cost_estimate || undefined;

  const plotWidth = site.plotWidth || 15;
  const plotLength = site.plotLength || 20;

  const exterior = data.exterior || {
    roofType: 'flat',
    showRoof: true,
    compoundWall: { height: 1.8, thickness: 0.2, materialId: '', show: true },
    gate: { position: { x: plotWidth / 2, y: plotLength }, width: 4, height: 1.8, type: 'sliding' },
    driveway: { width: 4, materialId: '', position: { x: plotWidth / 2, y: Math.max(0, plotLength - 2) } },
    parking: { spaces: 1, position: { x: Math.max(0, (plotWidth / 2) - 3), y: Math.max(0, plotLength - 2) } },
    trees: [],
    timeOfDay: 'afternoon'
  };

  return {
    ...data,
    id: data.id,
    name: data.name,
    userId: data.user_id || data.userId || '',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    updatedAt: data.updated_at || data.updatedAt || new Date().toISOString(),
    site,
    site_data: data.site_data || site,
    budget,
    budget_data: data.budget_data || budget,
    requirements,
    requirements_data: data.requirements_data || requirements,
    floors,
    floors_data: data.floors_data || floors,
    materials,
    materials_data: data.materials_data || materials,
    exterior,
    costEstimate,
    cost_estimate: data.cost_estimate || costEstimate
  };
}

export async function getUserProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(toProjectState);
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return toProjectState(data);
}

export async function createProject(
  name: string,
  siteData: SiteInfo,
  budgetData: Budget,
  requirementsData: Requirements
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      status: 'active',
      site_data: siteData,
      budget_data: budgetData,
      requirements_data: requirementsData,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Create initial version
  await createProjectVersion(project.id, 1, project);

  return toProjectState(project);
}

export async function updateProject(id: string, updates: Partial<ProjectState> & Record<string, any>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbUpdates: Record<string, any> = {
    updated_at: new Date().toISOString()
  };

  if ('name' in updates) dbUpdates.name = updates.name;
  if ('status' in updates) dbUpdates.status = updates.status;

  if ('floors' in updates) dbUpdates.floors_data = updates.floors;
  if ('floors_data' in updates) dbUpdates.floors_data = updates.floors_data;

  if ('site' in updates) dbUpdates.site_data = updates.site;
  if ('site_data' in updates) dbUpdates.site_data = updates.site_data;

  if ('budget' in updates) dbUpdates.budget_data = updates.budget;
  if ('budget_data' in updates) dbUpdates.budget_data = updates.budget_data;

  if ('requirements' in updates) dbUpdates.requirements_data = updates.requirements;
  if ('requirements_data' in updates) dbUpdates.requirements_data = updates.requirements_data;

  if ('materials' in updates) dbUpdates.materials_data = updates.materials;
  if ('materials_data' in updates) dbUpdates.materials_data = updates.materials_data;

  if ('exterior' in updates) dbUpdates.exterior = updates.exterior;
  if ('costEstimate' in updates) dbUpdates.cost_estimate = updates.costEstimate;
  if ('cost_estimate' in updates) dbUpdates.cost_estimate = updates.cost_estimate;

  const { data, error } = await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  // If Supabase schema lacks optional columns (exterior, cost_estimate), retry without them
  if (error && (error.message.includes('column') || error.code === 'PGRST204' || error.message.includes('schema cache'))) {
    const fallbackUpdates = { ...dbUpdates };
    delete fallbackUpdates.exterior;
    delete fallbackUpdates.cost_estimate;

    const retry = await supabase
      .from('projects')
      .update(fallbackUpdates)
      .eq('id', id)
      .select()
      .single();

    if (!retry.error && retry.data) {
      return toProjectState({ ...retry.data, exterior: updates.exterior, cost_estimate: updates.costEstimate });
    }
  }

  if (error) throw new Error(error.message);
  return toProjectState(data);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

export async function createProjectVersion(projectId: string, versionNumber: number, snapshot: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('project_versions')
    .insert({
      project_id: projectId,
      version_number: versionNumber,
      project_snapshot: snapshot,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getProjectVersions(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('project_versions')
    .select('*')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
