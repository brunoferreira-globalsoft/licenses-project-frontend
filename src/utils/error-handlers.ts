import { ResponseApi } from '@/types/responses';

interface ErrorInfo {
  succeeded: boolean;
  messages: string | string[] | unknown;
}

export const getErrorMessage = (
  response: ResponseApi<ErrorInfo>,
  defaultMessage: string = 'Ocorreu um erro'
): string => {
  const { messages } = response.info;

  if (Array.isArray(messages)) {
    return messages.join(', ');
  }

  if (typeof messages === 'string') {
    return messages;
  }

  return defaultMessage;
};

export const handleApiError = (
  error: unknown,
  defaultMessage: string = 'Ocorreu um erro'
): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'info' in error) {
    const apiResponse = error as ResponseApi<ErrorInfo>;
    return getErrorMessage(apiResponse, defaultMessage);
  }

  return defaultMessage;
};
