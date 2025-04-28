import { MenuItem } from '@/app/components/layout/vertical/sidebar/Sidebaritems';
import { Project } from '@/app/types/project';

export const projectsToMenuItems = (menuItems: MenuItem[], projects: Project[]): MenuItem[] => {
  return menuItems.reduce((acc, item) => {
    if (item.heading !== 'Projects') {
      return acc;
    }

    const itemsFromProjects = projects.map(({ name, id }) => ({
      name,
      icon: 'icon-folder',
      id,
      url: `/projects/${id}`,
    }));

    const newProjectActionItem = item.children?.find(({ id }) => id === 'newProject');

    if (newProjectActionItem) {
      return [
        ...acc,
        {
          ...item,
          children: [...itemsFromProjects, newProjectActionItem],
        },
      ];
    }

    return acc;

  }, [] as MenuItem[]);
};