import { AppPageContainer } from '@/components/common/AppPageContainer';
import { ContactMeForm } from './ContactMeForm';
import type { ContactMeFormValues } from '../types/contactMeForm.schema';

export type ContactStatus = 'idle' | 'sending';

type ContactProps = {
  status: ContactStatus;
  onSave: (form: ContactMeFormValues) => Promise<boolean>;
};

export const Contact = ({ status, onSave }: ContactProps) => {
  return (
    <AppPageContainer id="contact-me" sectionClassName="scroll-mt-32 bg-muted">
      <h1 className="text-left text-3xl font-bold uppercase leading-tight sm:text-4xl md:text-5xl">Contact Me</h1>
      <p>
        Got questions or want to connect? Whether you're curious about my work, have a project idea, or just want to chat about software development, feel free to reach out using the contact form below. I'll get back to you as soon as I can - looking
        forward to connecting!
      </p>
      <ContactMeForm saving={status === 'sending'} onSave={onSave} />
    </AppPageContainer>
  );
};
