import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import { apiClient } from '@/lib/api/apiClient';
import type { ContactEmailRequestDto, ContactEmailResponseDto } from '../types/contact.api.types';
import { contactService } from './contact.services';

vi.mock('@/lib/api/apiClient', () => ({
  apiClient: {
    post: vi.fn()
  }
}));

const apiClientMock = apiClient as unknown as {
  post: Mock;
};

describe('contactService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('sends a contact email request', async () => {
    // Arrange
    const request: ContactEmailRequestDto = {
      name: 'Franco Diaz',
      email: 'franco@example.com',
      message: 'Hello there'
    };
    const response: ContactEmailResponseDto = {
      contactMessageId: '5f4d0b3f-10a9-4c59-9e91-65cb3770887f'
    };
    apiClientMock.post.mockResolvedValue(response);

    // Act
    const result = await contactService.sendContactEmail(request);

    // Assert
    expect(result).toEqual(response);
    expect(apiClientMock.post).toHaveBeenCalledWith('/contactEmail', request);
  });
});
