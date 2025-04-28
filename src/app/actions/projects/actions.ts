import { db } from '@/lib/db';
import { Project } from '@/app/types/project';
import { getUser } from '@/app/actions/helpers';

export async function getProjects() {
  const user = await getUser();

  const { data, error } = await db
    .from('projects')
    .select('id, name, region, description, userId')
    .eq('userId', user.id)
    .order('createdAt', { ascending: false });

  if (error) throw error;

  return (data || []) as Project[];
}

export async function getProject({ id }: { id: string }) {
  const user = await getUser();

  const { data, error } = await db
    .from('projects')
    .select('id, name, region, description, userId')
    .eq('userId', user.id)
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createProject(formData: Partial<Project>): Promise<Project> {
  const { name, region, description } = formData ?? {};

  if (!name || !region || !description) {
    throw new Error('Missing required fields');
  }

  const user = await getUser();

  const { data, error } = await db.from('projects').insert({
    name,
    region,
    description,
    userId: user.id,
  }).select().single();

  if (error) throw error;

  return data! as Project;
}