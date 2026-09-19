/**
 * Paged response returned by list endpoints.
 *
 * The continuation token is opaque and should only be passed back to the API
 * when requesting the next page.
 */
export interface PageResult<T> {
  /** Items returned for the current page. */
  items: T[];

  /** Opaque cursor for the next page, or `null` when there are no more pages. */
  continuationToken: string | null;

  /** Indicates whether another page can be requested. */
  hasMore: boolean;
}

/**
 * Error response returned by the API for expected failures.
 */
export interface ApiError {
  /** HTTP status code associated with the failed request. */
  statusCode: number;

  /** Short error message returned by the API. */
  message: string;
}

/**
 * Error response used when the API rejects one or more submitted values.
 */
export interface ApiValidationError extends ApiError {
  /** Field or rule validation messages returned by the API. */
  validationErrors?: string[];
}

/**
 * Supported API error response shape, or `null` when an unknown error cannot be normalised.
 */
export type ApiErrorResponse = ApiError | ApiValidationError | null;

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
export interface BaseQuery {
  /** Maximum number of items to return. */
  pageSize?: number;

  /** Opaque cursor returned by a previous page, or `null` for the first page. */
  continuationToken?: string | null;

  /** Field name to sort by, or `null` for endpoint default ordering. */
  sortBy?: string | null;

  /** Sort direction, or `null` for endpoint default ordering. */
  sortDirection?: SortByDirection;

  /** Field name to search within, or `null` for endpoint default search scope. */
  searchBy?: string | null;

  /** Search text, or `null` when search is not applied. */
  searchTerm?: string | null;

  /** Whether filters should match all rules or any rule. */
  filterMatch?: FilterMatch | null;

  /** Structured filters to apply. */
  filters?: QueryFilter[];

  /** Optional include expression for endpoints that support expanded data. */
  include?: string | null;
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
