'use client';

import { createProject } from '@/app/actions/projects/actions';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/app/(pages)/projects/components';

export default function NewProject() {
  const router = useRouter();

  const handleCreateProject = async (formData: FormData) => {
    await createProject(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ProjectForm action={handleCreateProject} title="Create a new project">
        <div className="flex w-full items-end justify-end gap-3">
          <Button type="submit" color="primary">Save changes</Button>
          <Button color="muted" onClick={() => router.push('/')}>Cancel</Button>
        </div>
      </ProjectForm>
    </div>
  );
}