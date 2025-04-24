import { SetMetadata } from '@nestjs/common';

export const CUSTOM_MESSAGE = 'custom-message';

export const Message = (message: string) =>
  SetMetadata(CUSTOM_MESSAGE, message);
