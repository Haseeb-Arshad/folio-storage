import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { extractBearerToken, verifyToken } from '../utils/authUtils';
import { UserModel } from '../models/userModel';
import { logger } from '../utils/logger';

/**
 * Interface for the authenticated request with user data
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

/**
 * Middleware to protect routes by verifying JWT tokens
 */
export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  
  // Get the token from the Authorization header
  const token = extractBearerToken(req.headers.authorization);
  
  if (!token) {
    logger.warn('Authentication failed: No token provided');
    res.status(401).json({ 
      success: false,
      message: 'Authentication required. No token provided.' 
    });
    return;
  }
  
  // Verify the token
  const decoded = verifyToken(token);
  
  if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
    logger.warn('Authentication failed: Invalid or expired token');
    res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token.' 
    });
    return;
  }
  
  // Check if user exists
  UserModel.getUserById(decoded.id)
    .then(user => {
      if (!user) {
        logger.warn(`Authentication failed: User not found with id ${decoded.id}`);
        res.status(404).json({ 
          success: false,
          message: 'User not found.' 
        });
        return;
      }
      
      // Attach user to request object
      authReq.user = {
        id: user.id,
        email: user.email,
        ...decoded
      };
      
      logger.debug(`User authenticated: ${user.email}`);
      next();
    })
    .catch(error => {
      logger.error('Error during authentication:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during authentication.' 
      });
    });
};

/**
 * Optional authentication middleware that allows access to public resources
 * but attaches user data to the request if a valid token is provided
 */
export const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const token = extractBearerToken(req.headers.authorization);
    
    if (!token) {
      // Continue without authentication
      return next();
    }
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      // Continue without authentication
      return next();
    }
    
    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    // Continue without authentication in case of errors
    next();
  }
};
