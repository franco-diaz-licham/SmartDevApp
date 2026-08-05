import { useEffect } from 'react';
import { appConfig } from '@/app/appConfig';

export const NotesPage = () => {
  useEffect(() => {
    document.title = `Notes | ${appConfig.appName}`;
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-12 text-foreground">
      <section className="mx-auto max-w-5xl rounded-2xl border border-border bg-card p-8 shadow-xl sm:p-12">
        <p className="text-sm font-extrabold uppercase tracking-wide text-primary">Private owner workspace</p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">Notes</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          This protected space will hold your markdown-driven learning notes, reading summaries, technical logs, and searchable engineering knowledge base.
        </p>
      </section>
    </main>
  );
};
