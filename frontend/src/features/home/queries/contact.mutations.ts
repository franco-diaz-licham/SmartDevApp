import { useMutation } from '@tanstack/react-query';
import { mapContactEmailResponseDtoToModel, mapContactMeFormToRequestDto } from '../mappers/contact.mapper';
import { contactService } from '../services/contact.services';
import type { ContactMeFormValues } from '../types/contactMeForm.schema';

export const useSendContactEmailMutation = () =>
  useMutation({
    mutationFn: async (form: ContactMeFormValues) => mapContactEmailResponseDtoToModel(await contactService.sendContactEmail(mapContactMeFormToRequestDto(form)))
  });
