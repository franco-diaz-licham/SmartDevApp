import UilEstate from '@iconscout/react-unicons/icons/uil-estate';
import UilFileAlt from '@iconscout/react-unicons/icons/uil-file-alt';
import UilSignout from '@iconscout/react-unicons/icons/uil-signout';
import UilUser from '@iconscout/react-unicons/icons/uil-user';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { cn } from '@/lib/cn';

const workspaceNavigationItems = [
  { label: 'Notes', to: '/notes', icon: UilFileAlt },
  { label: 'Admin', to: '/admin', icon: UilUser }
] as const;

const workspaceLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-bold no-underline transition hover:bg-muted',
    isActive ? 'bg-primary text-primary-foreground hover:bg-primary' : 'text-foreground'
  );

export const WorkspaceTopBar = () => {
  const { account, interactionInProgress, logout } = useAuth();

  const handleLogout = () => {
    void logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex min-h-16 max-w-[1320px] flex-wrap items-center gap-3 px-4 py-3">
        <Link className="mr-auto inline-flex items-center gap-2 text-sm font-extrabold uppercase text-foreground no-underline" to="/home">
          <UilEstate aria-hidden="true" size={22} />
          SmartDev
        </Link>

        <div className="flex items-center gap-2">
          {workspaceNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink className={workspaceLinkClassName} key={item.to} to={item.to}>
                <Icon aria-hidden="true" size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="ml-auto hidden max-w-56 truncate text-right text-sm text-muted-foreground sm:block">
          <span className="block truncate font-semibold text-foreground">{account?.name ?? 'Owner'}</span>
          <span className="block truncate">{account?.username}</span>
        </div>

        <button
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-bold text-foreground transition hover:cursor-pointer hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={interactionInProgress}
          onClick={handleLogout}
        >
          <UilSignout aria-hidden="true" size={20} />
          Log out
        </button>
      </nav>
    </header>
  );
};
