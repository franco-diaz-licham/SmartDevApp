import type { ChangeEvent } from 'react';
import { AppHoneypot } from '@/components/common/AppHoneypot';
import { AppButton } from '@/components/ui/AppButton';
import { AppInputText } from '@/components/ui/AppInputText';
import { AppInputTextArea } from '@/components/ui/AppInputTextArea';
import type { useContactMeForm } from '../hooks/useContactMeForm';
import { contactMeFormLimits, type ContactMeFormValues } from '../types/contactMeForm.schema';

type ContactMeFormProps = {
  form: ReturnType<typeof useContactMeForm>;
  saving: boolean;
  onSave: (form: ContactMeFormValues) => void;
};

const getInputValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.value;

export const ContactMeForm = ({ form, saving, onSave }: ContactMeFormProps) => {
  const { draft, errors } = form;
  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = () => {
    const validForm = form.getValidForm();
    if (!validForm) return;
    void onSave(validForm);
  };

  return (
    <div className="grid gap-4 px-[15%]">
      <AppHoneypot
        id="companyWebsite"
        label="Company website"
        name="companyWebsite"
        value={draft.companyWebsite}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          form.updateField('companyWebsite', getInputValue(event));
        }}
      />
      <AppInputText
        error={errors.name}
        id="name"
        label="Name:"
        maxLength={contactMeFormLimits.name}
        name="name"
        required
        value={draft.name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          form.updateField('name', getInputValue(event));
        }}
      />
      <AppInputText
        error={errors.email}
        id="email"
        label="Email:"
        maxLength={contactMeFormLimits.email}
        name="email"
        required
        type="email"
        value={draft.email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          form.updateField('email', getInputValue(event));
        }}
      />
      <AppInputTextArea
        error={errors.message}
        id="message"
        label="Message:"
        maxLength={contactMeFormLimits.message}
        name="message"
        required
        rows={5}
        value={draft.message}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          form.updateField('message', getInputValue(event));
        }}
      />
      <div className="flex items-end justify-end">
        <AppButton disabled={saving || !form.isValid || hasErrors} onClick={handleSave}>
          {saving ? 'Sending...' : 'Submit'}
        </AppButton>
      </div>
    </div>
  );
};
