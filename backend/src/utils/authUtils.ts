import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User } from '../models/types';

/**
 * Generate a JWT token for authenticated users
 */
export const generateToken = (user: Partial<User>): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      full_name: user.full_name
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRATION
    }
  );
};

/**
 * Verify a JWT token and extract the user data
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

/**
 * Parse a bearer token from the authorization header
 * Format: "Bearer <token>"
 */
export const extractBearerToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
};
