import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-16">
      <h1 className="pb-4 text-3xl font-bold uppercase leading-tight sm:text-4xl md:text-5xl">Page Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link className="font-bold text-primary no-underline hover:underline" to="/home">
        Return home
      </Link>
    </main>
  );
};
