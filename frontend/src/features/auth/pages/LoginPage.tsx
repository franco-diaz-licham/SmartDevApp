import UilMicrosoft from '@iconscout/react-unicons/icons/uil-microsoft';
import UilArrowLeft from '@iconscout/react-unicons/icons/uil-arrow-left';
import { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
import logoImage from '@/assets/images/logo.png';
import { AppButton } from '@/components/ui/AppButton';
import { useAuth } from '../hooks/useAuth';

const getSafeReturnPath = (value: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/notes';
  return value;
};

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isAuthReady, interactionInProgress, login } = useAuth();
  const returnTo = getSafeReturnPath(searchParams.get('returnTo'));

  useEffect(() => {
    document.title = `Sign in | ${appConfig.appName}`;
  }, []);

  if (isAuthenticated) return <Navigate to={returnTo} replace />;

  const handleLogin = () => {
    void login(returnTo);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-sm rounded-lg border border-border bg-background px-8 py-10 text-center shadow-xl sm:max-w-md sm:px-12">
        <img src={logoImage} className="mx-auto mb-6 size-30 object-contain" alt="SmartDev" />
        <h1 className="text-3xl font-extrabold leading-tight text-foreground">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to continue to SmartDev.</p>
        <div className="my-8 border-t border-border" />
        <div className="flex flex-col gap-5 items-center">
          <AppButton className="mb-0 mt-0 w-full rounded-full" disabled={!isAuthReady || interactionInProgress} onClick={handleLogin}>
            <UilMicrosoft aria-hidden="true" className="size-5" />
            {interactionInProgress || !isAuthReady ? 'Connecting...' : 'Sign in with Microsoft'}
          </AppButton>
          <Link className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground no-underline hover:text-foreground hover:underline" to="/home">
            <UilArrowLeft aria-hidden="true" size={20} />
            Back home
          </Link>
        </div>
        <p className="mx-auto mt-5 max-w-xs text-sm leading-6 text-muted-foreground">Access is limited to Admin of the website.</p>
      </section>
    </main>
  );
};
