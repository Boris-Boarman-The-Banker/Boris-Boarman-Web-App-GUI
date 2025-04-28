import { useProjectStore } from '@/lib/store/projects/projectsStore';
import { getProjects } from '@/app/actions/projects/actions';

export const useProjects = () => {
  const { setProjects } = useProjectStore();

  const refreshProjects = async () => {
    try {
      const projects = await getProjects();
      setProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return {
    refreshProjects
  };
};