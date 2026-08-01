import { type FormEvent, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';

type ContactStatus = 'idle' | 'sending' | 'sent' | 'failed';

export const Contact = () => {
  const [status, setStatus] = useState<ContactStatus>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const base = import.meta.env.VITE_API_BASE_URL ?? '';
      const response = await fetch(`${base}/api/contactEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') ?? '').trim(),
          email: String(formData.get('email') ?? '').trim(),
          message: String(formData.get('message') ?? '').trim()
        })
      });

      setStatus(response.ok ? 'sent' : 'failed');
      if (response.ok) form.reset();
    } catch {
      setStatus('failed');
    }
  };

  return (
    <section id="contact-me" className="bg-muted">
      <div className="mx-auto max-w-[1320px] px-4 py-16">
        <h1 className="pb-4">Get In Touch</h1>
        <p className="pb-4">
          Got questions or want to connect? Whether you're curious about my work, have a project idea, or just want to chat about software development, feel free to reach out using the contact form below. I'll get back to you as soon as I can -
          looking forward to connecting!
        </p>
        <form className="grid gap-4 px-[15%]" onSubmit={handleSubmit}>
          <label className="grid gap-1 font-semibold" htmlFor="name">
            Name:
            <input id="name" className="min-h-10 rounded border border-border px-3" type="text" name="name" required />
          </label>
          <label className="grid gap-1 font-semibold" htmlFor="email">
            Email:
            <input id="email" className="min-h-10 rounded border border-border px-3" type="email" name="email" required />
          </label>
          <label className="grid gap-1 font-semibold" htmlFor="message">
            Message:
            <textarea id="message" className="rounded border border-border px-3 py-2" name="message" rows={5} required />
          </label>
          <div className="mt-4">
            <AppButton type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Submit'}
            </AppButton>
          </div>
          {status === 'sent' && <p role="status">Thanks! Message sent.</p>}
          {status === 'failed' && (
            <p role="alert" className="text-destructive">
              Message could not be sent. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};
