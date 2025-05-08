'use client';

import { createProject } from '@/app/actions/projects/actions';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/app/(pages)/projects/components';
import { useProjects } from '@/app/hooks/useProjects';
import { Project } from '@/app/types/project';
import { useState } from 'react';

export default function NewProject() {
  const [inProgress, setInProgress] = useState(false);
  const router = useRouter();
  const { refreshProjects } = useProjects();

  const handleCreateProject = async (formData: Partial<Project>) => {
    setInProgress(true);
    try {
      const newProject = await createProject(formData);
      if (newProject) {
        router.push(`/projects/${newProject.id}`);
      }

      await refreshProjects();
    } catch (error) {
      console.error(error);
    } finally {
      setInProgress(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ProjectForm action={handleCreateProject} title="Create a new project">
        <div className="flex w-full items-end justify-end gap-3">
          <Button type="submit" color="primary" disabled={inProgress}>Save changes</Button>
          <Button color="muted" onClick={() => router.push('/')}>Cancel</Button>
        </div>
      </ProjectForm>
    </div>
  );
}