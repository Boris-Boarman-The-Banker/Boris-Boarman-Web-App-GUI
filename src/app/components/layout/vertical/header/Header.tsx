'use client';
import React, { useEffect, useState } from 'react';
import { Button, Drawer, Navbar } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Profile from './Profile';
import MobileSidebar from '../sidebar/MobileSidebar';
import { useAuth } from '@/lib/AuthProvider';

const Header = () => {
  const { user, loading } = useAuth();

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // mobile-sidebar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <header
        className={`z-[5] ${
          isSticky
            ? 'bg-lightgray dark:bg-dark shadow-md fixed w-full'
            : 'bg-transparent'
        }`}
      >
        <Navbar
          fluid
          className={`rounded-none bg-transparent dark:bg-transparent py-4 sm:px-30 px-4`}
        >
          <div className="flex gap-3 items-center justify-between w-full ">
            {user &&
                <div className="flex gap-2 items-center">
                    <span
                        onClick={() => setIsOpen(true)}
                        className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
                    >
                        <Icon icon="solar:hamburger-menu-line-duotone" height={21}/>
                    </span>
                </div>
            }

            <div className="flex gap-4 items-center">
              {user ?
                <Profile user={user}/>
                : !loading ? <Button color="primary" href="/auth/login">Login</Button> : null
              }
            </div>
          </div>
        </Navbar>
      </header>
      {user &&
          <Drawer open={isOpen} onClose={handleClose} className="w-130">
              <Drawer.Items>
                  <MobileSidebar/>
              </Drawer.Items>
          </Drawer>
      }
    </>
  );
};

export default Header;
