export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogEntries: number;
  private minLogLevel: LogLevel;
  
  constructor(options?: { maxLogEntries?: number; minLogLevel?: LogLevel }) {
    this.maxLogEntries = options?.maxLogEntries || 1000;
    this.minLogLevel = options?.minLogLevel || 'info';
  }
  
  /**
   * Log a message at the specified level
   */
  log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // Check if we should log this level
    if (!this.shouldLog(level)) {
      return;
    }
    
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context
    };
    
    // Add entry to logs
    this.logs.push(entry);
    
    // Trim logs if we exceed the maximum
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }
    
    // Also output to console for development
    this.consoleLog(entry);
  }
  
  /**
   * Debug level log
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }
  
  /**
   * Info level log
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }
  
  /**
   * Warning level log
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }
  
  /**
   * Error level log
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }
  
  /**
   * Get the most recent logs
   */
  getRecentLogs(count: number = 50, level?: LogLevel): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-count);
  }
  
  /**
   * Get logs by context property
   */
  getLogsByContext(property: string, value: unknown, count: number = 50): LogEntry[] {
    const filteredLogs = this.logs.filter(log => {
      return log.context && log.context[property] === value;
    });
    
    return filteredLogs.slice(-count);
  }
  
  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }
  
  /**
   * Set the minimum log level
   */
  setMinLogLevel(level: LogLevel): void {
    this.minLogLevel = level;
  }
  
  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.minLogLevel];
  }
  
  /**
   * Output a log entry to the console
   */
  private consoleLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const formattedContext = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    
    const logMethod = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error
    }[entry.level] || console.log;
    
    logMethod(`[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${formattedContext}`);
  }
} 