/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}


const SidebarContent: MenuItem[] = [
  {
    heading: 'Projects',
    children: [
      {
        name: '+ Add new project',
        icon: 'icon-plus',
        color: 'red',
        id: 'newProject',
        url: '/projects/new',
      }
    ],
  }
];

export default SidebarContent;
