import heroImage from '@/assets/images/hero.png';
import { AppHero } from '@/components/common/AppHero';
import { useAppToast } from '@/components/common/AppToastContext';
import { AboutMe } from '../components/AboutMe';
import { Contact } from '../components/ContactMe';
import { Experience } from '../components/Experience';
import { Portfolio } from '../components/Portfolio';
import { useSendContactEmailMutation } from '../queries/contact.mutations';
import type { ContactMeFormValues } from '../types/contactMeForm.schema';

export const HomePage = () => {
  const toast = useAppToast();
  const sendContactEmailMutation = useSendContactEmailMutation();

  const handleContactSave = async (validForm: ContactMeFormValues) => {
    if (validForm.companyWebsite.trim()) {
      toast.success({
        title: 'Message sent',
        message: 'Thanks! Message sent.'
      });
      return true;
    }

    try {
      await sendContactEmailMutation.mutateAsync(validForm);
      toast.success({
        title: 'Message sent',
        message: 'Thanks! Message sent.'
      });
      return true;
    } catch {
      toast.error({
        title: 'Message failed',
        message: 'Message could not be sent. Please try again.'
      });
      return false;
    }
  };

  return (
    <main>
      <AppHero backgroundImage={heroImage} subtitle="SmartDev: Smart Software Made Simple" title={'Franco Diaz\nFull-Stack Engineer'} />
      <AboutMe />
      <Experience />
      <Portfolio />
      <Contact status={sendContactEmailMutation.isPending ? 'sending' : 'idle'} onSave={handleContactSave} />
    </main>
  );
};
