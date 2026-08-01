import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-16">
      <h1 className="pb-4">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="font-bold text-primary" to="/home">
        Return home
      </Link>
    </main>
  );
};
