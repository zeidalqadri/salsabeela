interface LogEntry {
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

export class LoggerService {
  private logs: LogEntry[] = []

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata)
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata)
  }

  private log(level: LogEntry['level'], message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata
    }
    this.logs.push(entry)
    console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, metadata || '')
  }

  getLogs(): LogEntry[] {
    return this.logs
  }
} 