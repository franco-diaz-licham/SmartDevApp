import { useState } from 'react';
import heroImage from '@/assets/images/hero.png';
import { AppHero } from '@/components/common/AppHero';
import { AboutMe } from '../components/AboutMe';
import { Contact, type ContactStatus } from '../components/ContactMe';
import { Experience } from '../components/Experience';
import { Portfolio } from '../components/Portfolio';
import type { ContactMePayload, ContactMeFormValues } from '../types/contactMeForm.schema';

export const HomePage = () => {
  const [contactStatus, setContactStatus] = useState<ContactStatus>('idle');

  const handleContactSave = async (validForm: ContactMeFormValues) => {
    if (validForm.companyWebsite.trim()) {
      setContactStatus('sent');
      return true;
    }

    setContactStatus('sending');
    const payload: ContactMePayload = {
      name: validForm.name,
      email: validForm.email,
      message: validForm.message
    };

    try {
      const base = import.meta.env.VITE_API_BASE_URL ?? '';
      const response = await fetch(`${base}/api/contactEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setContactStatus(response.ok ? 'sent' : 'failed');
      return response.ok;
    } catch {
      setContactStatus('failed');
      return false;
    }
  };

  return (
    <main>
      <AppHero backgroundImage={heroImage} subtitle="SmartDev: Smart Software Made Simple" title={'Franco Diaz\nFull-Stack Developer'} />
      <AboutMe />
      <Experience />
      <Portfolio />
      <Contact status={contactStatus} onSave={handleContactSave} />
    </main>
  );
};
