import UilMicrosoft from '@iconscout/react-unicons/icons/uil-microsoft';
import UilShieldCheck from '@iconscout/react-unicons/icons/uil-shield-check';
import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { appConfig } from '@/app/appConfig';
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
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between bg-muted p-8 sm:p-12">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-primary">Owner workspace</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">Sign in to SmartDevApp</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Use your Microsoft account to manage private notes, drafts, and future admin tools.</p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 flex size-14 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UilShieldCheck aria-hidden="true" className="size-8" />
            </div>

            <h2 className="text-2xl font-extrabold text-foreground">Owner login</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Account creation is disabled. Only the configured owner account should be authorised by the API.</p>

            <AppButton className="mt-8 w-full" disabled={!isAuthReady || interactionInProgress} onClick={handleLogin}>
              <UilMicrosoft aria-hidden="true" className="size-5" />
              {interactionInProgress || !isAuthReady ? 'Connecting...' : 'Log in with Microsoft'}
            </AppButton>
          </div>
        </div>
      </section>
    </main>
  );
};
