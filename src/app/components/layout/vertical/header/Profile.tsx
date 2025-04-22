import { Dropdown } from 'flowbite-react';
import React from 'react';
import Image from 'next/image';
import { GoogleLogoutButton } from '@/app/components/GoogleLogoutButton';
import { User } from '@supabase/auth-js';

const Profile = ({ user }: { user: User | null }) => {
  if (!user) return null;

  const { user_metadata } = user;
  const { email, full_name } = user_metadata ?? {};

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44 sm:w-[360px]"
        dismissOnClick={false}
        renderTrigger={() => (
          <span
            className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <Image
              src={user_metadata?.avatar_url}
              alt="logo"
              height="35"
              width="35"
              className="rounded-full"
            />
          </span>
        )}
      >
        <div className="px-6"><h3 className="text-lg font-semibold text-ld">User Profile</h3>
          <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
            <Image
              alt="logo"
              loading="lazy"
              width="80"
              height="80"
              decoding="async"
              data-nimg="1"
              className="rounded-full"
              src={user_metadata?.avatar_url}
            />
            <div>
              {full_name && <h5 className="card-title">{full_name}</h5>}
              <p className="card-subtitle mb-0 mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                     role="img" className="text-base me-1 iconify iconify--solar" width="1em" height="1em"
                     viewBox="0 0 24 24">
                  <g fill="none">
                    <path stroke="currentColor" stroke-linecap="round" strokeWidth="1.5" d="M10.5 22v-2m4 2v-2"
                          opacity=".5"></path>
                    <path fill="currentColor"
                          d="M11 20v.75h.75V20zm3-.75a.75.75 0 0 0 0 1.5zm3.5-14a.75.75 0 0 0 0 1.5zM7 5.25a.75.75 0 0 0 0 1.5zm2 14a.75.75 0 0 0 0 1.5zm6 1.5a.75.75 0 0 0 0-1.5zm-4.75-9.5V20h1.5v-8.75zm.75 8H4.233v1.5H11zm-8.25-1.855V11.25h-1.5v6.145zm1.483 1.855c-.715 0-1.483-.718-1.483-1.855h-1.5c0 1.74 1.231 3.355 2.983 3.355zM6.5 6.75c1.967 0 3.75 1.902 3.75 4.5h1.5c0-3.201-2.246-6-5.25-6zm0-1.5c-3.004 0-5.25 2.799-5.25 6h1.5c0-2.598 1.783-4.5 3.75-4.5zm14.75 6v6.175h1.5V11.25zm-1.457 8H14v1.5h5.793zm1.457-1.825c0 1.12-.757 1.825-1.457 1.825v1.5c1.738 0 2.957-1.601 2.957-3.325zm1.5-6.175c0-3.201-2.246-6-5.25-6v1.5c1.967 0 3.75 1.902 3.75 4.5zM7 6.75h11v-1.5H7zm2 14h6v-1.5H9z"></path>
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M5 16h3"></path>
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"
                          d="M16 9.884V5.411m0 0V2.635c0-.236.168-.439.4-.484l.486-.093a3.2 3.2 0 0 1 1.755.156l.08.03c.554.214 1.16.254 1.737.115a.44.44 0 0 1 .542.427v2.221a.51.51 0 0 1-.393.499l-.066.016a3.2 3.2 0 0 1-1.9-.125a3.2 3.2 0 0 0-1.755-.156z"
                          opacity=".5"></path>
                  </g>
                </svg>
                {email}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          < GoogleLogoutButton/>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
