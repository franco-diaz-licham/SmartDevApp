import type { AxiosError } from 'axios';
import type { ApiError, ApiErrorResponse, ApiValidationError } from './api.types';

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const hasStringArray = <TKey extends string>(value: Record<string, unknown>, key: TKey): value is Record<TKey, string[]> => Array.isArray(value[key]) && value[key].every((item) => typeof item === 'string');

/**
 * Determines whether an unknown value is an API error object.
 */
export const isApiError = (error: unknown): error is ApiError => isObject(error);

/**
 * Determines whether an unknown value matches the API validation-error shape.
 */
export const isApiValidationError = (error: unknown): error is ApiValidationError => {
  if (!isObject(error) || !isApiError(error)) return false;
  return hasStringArray(error, 'validationErrors');
};

/**
 * Determines whether an unknown value is any supported API error response.
 */
export const isApiErrorResponse = (error: unknown): error is Exclude<ApiErrorResponse, null> => isApiError(error);

/**
 * Extracts the backend error response from an Axios error.
 *
 * Returns `null` when the error does not include an API response body.
 */
export const getApiErrorResponse = (error: unknown): ApiErrorResponse => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data ?? null;
};

/**
 * Gets the HTTP status code from a known API error or Axios error.
 */
export const getErrorStatusCode = (error: unknown): number | undefined => {
  const apiError = getApiErrorResponse(error);
  if (apiError) return apiError.statusCode;

  const axiosError = error as AxiosError;
  return axiosError.response?.status;
};

/**
 * Gets a short user-facing error summary.
 */
export const getErrorFeedbackSummary = (error: unknown): string => {
  const apiError = getApiErrorResponse(error);
  if (!apiError) return 'Something went wrong';
  return apiError.message;
};

/**
 * Gets the most useful user-facing error detail available.
 */
export const getErrorFeedbackDetail = (error: unknown): string => {
  const apiError = getApiErrorResponse(error);

  if (apiError && isApiValidationError(apiError) && apiError.validationErrors?.length) return apiError.validationErrors.join('\n');
  if (apiError) return apiError.message;
  if (error instanceof Error) return error.message;

  return String(error);
};
