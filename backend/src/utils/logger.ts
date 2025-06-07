import { config } from '../config/env';

/**
 * Logger utility for consistent logging across the application
 * Supports different log levels and formats logs based on environment
 */
class Logger {
  private context: string;
  
  constructor(context: string = 'App') {
    this.context = context;
  }
  
  /**
   * Format a log message with timestamp, level, and context
   */
  private formatLog(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }
  
  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    const formattedMessage = this.formatLog('INFO', message);
    console.log(formattedMessage, ...args);
  }
  
  /**
   * Log a debug message (only in development)
   */
  debug(message: string, ...args: any[]): void {
    if (config.NODE_ENV === 'development') {
      const formattedMessage = this.formatLog('DEBUG', message);
      console.debug(formattedMessage, ...args);
    }
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    const formattedMessage = this.formatLog('WARN', message);
    console.warn(formattedMessage, ...args);
  }
  
  /**
   * Log an error message
   */
  error(message: string | Error, ...args: any[]): void {
    const errorMessage = message instanceof Error ? `${message.message}\n${message.stack}` : message;
    const formattedMessage = this.formatLog('ERROR', errorMessage);
    console.error(formattedMessage, ...args);
  }
  
  /**
   * Create a new logger with a different context
   */
  withContext(context: string): Logger {
    return new Logger(context);
  }
}

// Export a default instance and the class
export const logger = new Logger();
export default Logger;
