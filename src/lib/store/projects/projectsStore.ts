import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Project } from '@/app/types/project';

type Actions = {
  clearStorage: () => void;
  setProjects: (projects?: Project[]) => void;
};

type State = {
  projects: Project[];
}

const initialState = {
  projects: []
};

export const useProjectStore = create<State & Actions>()(
  devtools(persist((set) => (
    {
      ...initialState,
      clearStorage: () => set(initialState),
      setProjects: (projects?: Project[]) => set({ projects: projects ?? [] }),
    }
  ), { name: 'projects-storage' }))
);
