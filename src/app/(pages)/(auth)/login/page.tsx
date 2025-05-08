'use client';

import { useRouter } from 'next/navigation';
import { GoogleLoginButton } from '@/app/components/GoogleLoginButton';
import { useAuth } from '@/lib/AuthProvider';
import Logo from '@/app/components/layout/shared/logo/Logo';
import AuthLogin from '@/app/(pages)/(auth)/authforms/AuthLogin';

const BoxedLogin = () => {
  const router = useRouter();

  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    router.push('/');
  }

  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted dark:bg-dark">
        <div className="flex h-full justify-center items-center px-4">
          <div
            className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words md:w-[450px] border-none ">
            <div className="flex h-full flex-col justify-center gap-2 p-0 w-full">
              <div className="mx-auto">
                <Logo/>
              </div>
              <div className="my-6">
                <GoogleLoginButton/>
              </div>
              <div className="inline-flex relative w-full items-center justify-center">
                <hr
                  className="my-3 h-px w-full border-0 bg-border dark:bg-darkborder !border-t !border-ld !bg-transparent"
                  data-testid="flowbite-hr-text" role="separator"/>
                <span
                  className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-base font-medium text-dark dark:bg-darkgray dark:text-white">or sign in with</span>
              </div>
              <AuthLogin/>
              <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
                {/*<Link*/}
                {/*  href={'/auth/register'}*/}
                {/*  className="text-primary text-sm font-medium"*/}
                {/*>*/}
                {/*  Create an account*/}
                {/*</Link>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoxedLogin;
