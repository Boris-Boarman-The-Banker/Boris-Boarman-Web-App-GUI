'use client';

import { Fragment, useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import SidebarContent, { MenuItem } from './Sidebaritems';
import NavItems from './NavItems';
import NavCollapse from './NavCollapse';
import SimpleBar from 'simplebar-react';
import FullLogo from '../../shared/logo/FullLogo';
import { Icon } from '@iconify/react';
import { useProjectStore } from '@/lib/store/projects/projectsStore';
import { projectsToMenuItems } from './utils';

const SidebarLayout = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SidebarContent);
  const { projects } = useProjectStore();

  useEffect(() => {
    if (projects) {
      setMenuItems((state) => projectsToMenuItems(state, projects));
    }
  }, [projects]);

  return (
    <div className="flex">
      <Sidebar
        className="fixed menu-sidebar pt-6 bg-white dark:bg-darkgray z-[10]"
        aria-label="Sidebar with multi-level dropdown example"
      >
        <div className="mb-7 px-4 brand-logo">
          <FullLogo/>
        </div>

        <SimpleBar className="h-[calc(100vh_-_120px)]">
          <Sidebar.Items className="px-4">
            <Sidebar.ItemGroup className="sidebar-nav">
              {menuItems.map(({ heading, children }, index) => (
                <Fragment key={index}>
                  {heading &&
                      <>
                          <h5 className="text-link font-semibold text-sm caption">
                              <span className="hide-menu">{heading}</span>
                          </h5>
                          <Icon
                              icon="solar:menu-dots-bold"
                              className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                              height={18}
                          />
                      </>
                  }

                  {children?.map((child, index) => (
                    <Fragment key={child.id && index}>
                      {child.children ? (
                        <div className="collpase-items">
                          <NavCollapse item={child}/>
                        </div>
                      ) : (
                        <NavItems item={child}/>
                      )}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </SimpleBar>
      </Sidebar>
    </div>
  );
};

export default SidebarLayout;
