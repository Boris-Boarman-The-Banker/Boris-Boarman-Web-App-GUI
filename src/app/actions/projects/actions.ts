import { db } from '@/lib/db';
import { Project } from '@/app/types/project';
import { getUser } from '@/app/actions/getUser';

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
    .limit(1)
    .order('createdAt', { ascending: false });

  if (error) throw error;

  return data && data.length > 0 ? data[0] : null;
}

export async function createProject(formData: FormData): Promise<Project> {

  const rawFormData = {
    name: formData.get('name'),
    region: formData.get('region'),
    description: formData.get('description'),
  };

  const { name, region, description } = rawFormData;

  if (!name || !region || !description) {
    throw new Error('Missing required fields');
  }

  const user = await getUser();

  const { data, error } = await db.from('projects').insert([
    {
      name,
      region,
      description,
      userId: user.id,
    },
  ]);

  if (error) throw error;

  return data! as Project;
}