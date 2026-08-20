import { describe, expect, test } from 'vitest';
import { getApiErrorResponse, getErrorFeedbackDetail, getErrorFeedbackSummary, getErrorStatusCode } from './apiError';

describe('apiError', () => {
  test('extracts api error responses from axios errors', () => {
    // Arrange
    const error = {
      response: {
        status: 400,
        data: {
          statusCode: 400,
          message: 'Article title is required.'
        }
      }
    };

    // Act
    const apiError = getApiErrorResponse(error);

    // Assert
    expect(apiError).toEqual({
      statusCode: 400,
      message: 'Article title is required.'
    });
    expect(getErrorFeedbackSummary(error)).toBe('Article title is required.');
    expect(getErrorFeedbackDetail(error)).toBe('Article title is required.');
    expect(getErrorStatusCode(error)).toBe(400);
  });

  test('extracts article slug conflict responses from axios errors', () => {
    // Arrange
    const error = {
      response: {
        status: 409,
        data: {
          statusCode: 409,
          message: "Article slug 'lorem' already exists."
        }
      }
    };

    // Act
    const apiError = getApiErrorResponse(error);

    // Assert
    expect(apiError).toEqual({
      statusCode: 409,
      message: "Article slug 'lorem' already exists."
    });
    expect(getErrorFeedbackSummary(error)).toBe("Article slug 'lorem' already exists.");
    expect(getErrorFeedbackDetail(error)).toBe("Article slug 'lorem' already exists.");
    expect(getErrorStatusCode(error)).toBe(409);
  });

  test('extracts validation error messages', () => {
    // Arrange
    const error = {
      response: {
        status: 400,
        data: {
          statusCode: 400,
          message: 'Validation failed.',
          validationErrors: ['Title is required.', 'Slug is required.']
        }
      }
    };

    // Act
    const summary = getErrorFeedbackSummary(error);
    const detail = getErrorFeedbackDetail(error);

    // Assert
    expect(summary).toBe('Validation failed.');
    expect(detail).toBe('Title is required.\nSlug is required.');
    expect(getErrorStatusCode(error)).toBe(400);
  });
});
