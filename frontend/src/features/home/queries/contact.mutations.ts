import { useMutation } from '@tanstack/react-query';
import { mapContactEmailResponseDtoToModel, mapContactMeFormToRequestDto } from '../mappers/contact.mapper';
import { contactService } from '../services/contact.services';
import type { ContactMeFormValues } from '../types/contactMeForm.schema';

/**
 * Sends the contact form payload through the contact email API.
 *
 * @returns React Query mutation state for submitting a contact request.
 */
export const useSendContactEmailMutation = () =>
  useMutation({
    mutationFn: async (form: ContactMeFormValues) => mapContactEmailResponseDtoToModel(await contactService.sendContactEmail(mapContactMeFormToRequestDto(form)))
  });
