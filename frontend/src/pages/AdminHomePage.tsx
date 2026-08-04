import { useAuth } from '@/features/auth';

export const AdminHomePage = () => {
  const { account, logout, interactionInProgress } = useAuth();

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8 shadow-xl">
        <p className="text-sm font-extrabold uppercase tracking-wide text-primary">Admin</p>
        <h1 className="mt-3 text-4xl font-extrabold text-foreground">SmartDevApp owner workspace</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Frontend Microsoft Entra login is wired. Backend owner-only token validation comes next before real admin actions are added.</p>

        {account && (
          <div className="mt-8 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
            <p>
              Signed in as <span className="font-semibold text-foreground">{account.name ?? account.username}</span>
            </p>
            <p className="mt-1">Tenant: {account.tenantId}</p>
          </div>
        )}

        <button className="mt-8 rounded-md border border-border px-4 py-2 font-semibold hover:bg-muted disabled:opacity-60" type="button" disabled={interactionInProgress} onClick={() => void logout()}>
          Log out
        </button>
      </section>
    </main>
  );
};

