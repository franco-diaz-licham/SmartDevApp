import type { ContactEmailRequestDto, ContactEmailResponseDto } from '../types/contact.api.types';
import type { ContactMeFormValues } from '../types/contactMeForm.schema';
import type { ContactEmailResultModel } from '../types/contact.types';

export const mapContactMeFormToRequestDto = (form: ContactMeFormValues): ContactEmailRequestDto => ({
  name: form.name,
  email: form.email,
  message: form.message
});

export const mapContactEmailResponseDtoToModel = (response: ContactEmailResponseDto): ContactEmailResultModel => ({
  contactMessageId: response.contactMessageId
});
