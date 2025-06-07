/**
 * Custom API error class with status code and optional details
 */
export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad Request', details?: any) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message: string = 'Unauthorized', details?: any) {
    return new ApiError(401, message, details);
  }

  static forbidden(message: string = 'Forbidden', details?: any) {
    return new ApiError(403, message, details);
  }

  static notFound(message: string = 'Resource not found', details?: any) {
    return new ApiError(404, message, details);
  }

  static conflict(message: string = 'Conflict', details?: any) {
    return new ApiError(409, message, details);
  }

  static tooLarge(message: string = 'Payload too large', details?: any) {
    return new ApiError(413, message, details);
  }
  
  static unsupportedMedia(message: string = 'Unsupported media type', details?: any) {
    return new ApiError(415, message, details);
  }

  static internal(message: string = 'Internal Server Error', details?: any) {
    return new ApiError(500, message, details);
  }
}

/**
 * Global error handler middleware
 */
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Request as ExpressRequest } from 'express';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = undefined;

  // Check if this is our custom API error
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors from libraries like Zod
    statusCode = 400;
    message = 'Validation Error';
    details = err.message;
  } else if (err.name === 'UnauthorizedError') {
    // Handle JWT authentication errors
    statusCode = 401;
    message = 'Unauthorized';
    details = err.message;
  }

  // Send the error response
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Type for async request handlers with custom request type
 */
type AsyncRequestHandler<T = any> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Async route handler wrapper to eliminate try/catch boilerplate
 * @param fn Async request handler function
 * @returns Express request handler
 */
export function asyncHandler<T = ExpressRequest>(
  fn: AsyncRequestHandler<T>
): RequestHandler {
  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as unknown as T, res, next)).catch(next);
  };
}
