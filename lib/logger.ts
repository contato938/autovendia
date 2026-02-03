export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      level,
      message,
      timestamp,
      ...context,
    });
  }

  info(message: string, context?: LogContext) {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, context || '');
    } else {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext) {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    } else {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, context?: LogContext) {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, context || '');
    } else {
      console.error(this.formatMessage('error', message, context));
    }
  }

  debug(message: string, context?: LogContext) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }
}

export const logger = new Logger();
