/**
 * Cursor-paged response returned by document-store backed endpoints.
 *
 * The continuation token is opaque and should only be passed back to the API
 * when requesting the next page.
 */
export interface CursorPageResult<T> {
  /** Items returned for the current page. */
  items: T[];

  /** Opaque cursor for the next page, or `null` when there are no more pages. */
  continuationToken: string | null;

  /** Indicates whether another page can be requested. */
  hasMore: boolean;
}

/**
 * Base shape shared by API error responses.
 */
export interface ApiBaseError {
  /** HTTP status code associated with the failed request. */
  statusCode: number;

  /** Optional short error summary suitable for user feedback. */
  message?: string;
}

/**
 * Error response used when the API rejects one or more submitted values.
 */
export interface ApiValidationError extends ApiBaseError {
  /** Field or rule validation messages returned by the API. */
  validationErrors?: string[];
}

/**
 * Error response used for non-validation failures.
 */
export interface ApiError extends ApiBaseError {
  /** Detailed error message returned by the API. */
  details: string;
}

/**
 * Supported API error response shape, or `null` when an unknown error cannot be normalised.
 */
export type ApiErrorResponse = ApiValidationError | ApiError | null;

/**
 * Filter descriptor sent to query endpoints that support structured filtering.
 */
export interface QueryFilter {
  /** API field name to filter against. */
  field: string;

  /** Filter operator to apply to the field. */
  operator: FilterOperators;

  /** Filter value. */
  value: unknown;
}

/**
 * Generic query-string parameter bag accepted by the HTTP client.
 */
export type ApiQueryParams = Record<string, unknown>;

/**
 * Common query parameters for list endpoints.
 */
export interface BaseQueryParams {
  /** Maximum number of items to return. */
  pageSize: number;

  /** Field name to sort by, or `null` for endpoint default ordering. */
  sortBy: string | null;

  /** Sort direction, or `null` for endpoint default ordering. */
  sortDirection: SortByDirection;

  /** Field name to search within, or `null` for endpoint default search scope. */
  searchBy: string | null;

  /** Search text, or `null` when search is not applied. */
  searchTerm: string | null;

  /** Whether filters should match all rules or any rule. */
  filterMatch: FilterMatch | null;

  /** Structured filters to apply. */
  filters: QueryFilter[];

  /** Optional include expression for endpoints that support expanded data. */
  include: string | null;
}

/**
 * Query parameters for continuation-token based pagination.
 */
export interface CursorQueryParams {
  /** Maximum number of items to return. */
  pageSize: number;

  /** Opaque cursor returned by a previous page, or `null` for the first page. */
  continuationToken: string | null;
}

/**
 * HTTP status codes used by API error handling.
 */
export const StatusCode = {
  Okay: 200,
  Accepted: 201,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  ServerError: 500
} as const;

/**
 * Supported sort directions.
 */
export type SortByDirection = 'asc' | 'desc' | null;

/**
 * Supported filter match modes.
 */
export type FilterMatch = 'all' | 'any';

/**
 * Supported structured filter operators.
 */
export type FilterOperators = StringFilterOperators | DateFilterOperators | NumericFilterOperators;

/**
 * Supported string filter operators.
 */
export type StringFilterOperators = 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith';

/**
 * Supported date filter operators.
 */
export type DateFilterOperators = 'before' | 'after' | 'between';

/**
 * Supported numeric filter operators.
 */
export type NumericFilterOperators = 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
