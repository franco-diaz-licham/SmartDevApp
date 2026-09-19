import { apiClient } from '@/lib/api/apiClient';
import type { ContactEmailRequestDto, ContactEmailResponseDto } from '../types/contact.api.types';

const CONTACT_EMAIL_URL = '/contactEmail';

export const contactService = {
  sendContactEmail(request: ContactEmailRequestDto): Promise<ContactEmailResponseDto> {
    return apiClient.post<ContactEmailResponseDto>(CONTACT_EMAIL_URL, request);
  }
};
