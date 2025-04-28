import { getProjects } from '@/app/actions/projects/actions';
import { useProjectStore } from '@/lib/store/projects/projectsStore';
import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthProvider';

export const usePostLoginActions = () => {
  const { setProjects } = useProjectStore();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        setProjects(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [setProjects, user?.id]);
};