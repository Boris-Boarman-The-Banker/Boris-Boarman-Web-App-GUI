'use client';

import { Button, Spinner } from 'flowbite-react';
import { ProjectForm } from '@/app/(pages)/projects/components';
import { getProject } from '@/app/actions/projects/actions';
import { use, useEffect, useState } from 'react';
import { Project } from '@/app/types/project';
import { useRouter } from 'next/navigation';

export default function EditProject(
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const { id } = use(params);

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProject({ id });
      setProject(projectData);
    };

    if (id) {
      fetchProject();
    }

  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center">
      {!project
        ? <Spinner size="xl"/>
        : <ProjectForm readonly project={project}>
          <div className="flex w-full items-end justify-end gap-3">
            <Button color="muted" onClick={() => router.push('/')}>Cancel</Button>
          </div>
        </ProjectForm>
      }
    </div>
  );
}