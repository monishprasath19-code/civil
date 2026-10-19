'use server'

import { createProject as dbCreateProject, deleteProject as dbDeleteProject } from '@/services/projectService'
import { SiteInfo, Budget, Requirements } from '@/models/project'
import { revalidatePath } from 'next/cache'

export async function createProjectAction(name: string, siteData: SiteInfo, budgetData: Budget, requirementsData: Requirements) {
  try {
    const project = await dbCreateProject(name, siteData, budgetData, requirementsData);
    revalidatePath('/dashboard');
    return { data: project, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create project' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await dbDeleteProject(id);
    revalidatePath('/dashboard');
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete project' };
  }
}

import { updateProject as dbUpdateProject } from '@/services/projectService'

export async function updateProjectAction(id: string, updates: any) {
  try {
    await dbUpdateProject(id, updates);
    revalidatePath('/dashboard');
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update project' };
  }
}

