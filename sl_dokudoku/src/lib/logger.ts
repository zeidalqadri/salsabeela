/**
 * Simple logger utility for the application
 * In a production environment, consider using a more robust logging solution
 */
export const logger = {
  /**
   * Log an informational message
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  info: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      console.log(`[INFO] ${message}`, ...optionalParams);
    }
  },

  /**
   * Log a warning message
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  warn: (message: string, ...optionalParams: any[]) => {
    console.warn(`[WARN] ${message}`, ...optionalParams);
  },

  /**
   * Log an error message
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  error: (message: string, ...optionalParams: any[]) => {
    console.error(`[ERROR] ${message}`, ...optionalParams);
  },

  /**
   * Log a debug message (only in development)
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  debug: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== 'production' && process.env.DEBUG === 'true') {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  }
}; 