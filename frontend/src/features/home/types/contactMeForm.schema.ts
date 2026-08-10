import { z } from 'zod';

export const contactMeFormLimits = {
  name: 100,
  email: 254,
  message: 2000
} as const;

export const contactMeFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(contactMeFormLimits.name, `Name must be ${contactMeFormLimits.name} characters or less.`),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.').max(contactMeFormLimits.email, `Email must be ${contactMeFormLimits.email} characters or less.`),
  message: z.string().trim().min(1, 'Message is required.').max(contactMeFormLimits.message, `Message must be ${contactMeFormLimits.message} characters or less.`),
  companyWebsite: z.string().default('')
});

export type ContactMeFormValues = z.infer<typeof contactMeFormSchema>;
export type ContactMeFormErrors = Partial<Record<keyof ContactMeFormValues, string>>;
