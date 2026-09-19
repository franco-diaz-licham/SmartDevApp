export interface ContactEmailRequestDto {
  name: string;
  email: string;
  message: string;
}

export interface ContactEmailResponseDto {
  contactMessageId: string;
}
