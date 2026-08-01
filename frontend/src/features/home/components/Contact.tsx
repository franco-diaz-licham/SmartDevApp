import { type FormEvent, useState } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';

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
    <section id="contact-me" className="scroll-mt-32 bg-muted">
      <div className="mx-auto max-w-[1320px] px-4 py-16">
        <h1 className="pb-6 text-left text-5xl font-bold uppercase leading-[1.1]">Get In Touch</h1>
        <p className="pb-4">
          Got questions or want to connect? Whether you're curious about my work, have a project idea, or just want to chat about software development, feel free to reach out using the contact form below. I'll get back to you as soon as I can -
          looking forward to connecting!
        </p>
        <form className="grid gap-4 px-[15%]" onSubmit={handleSubmit}>
          <AppInputText id="name" label="Name:" name="name" required />
          <AppInputText id="email" label="Email:" name="email" type="email" required />
          <AppInputTextArea id="message" label="Message:" name="message" rows={5} required />
          <div>
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
