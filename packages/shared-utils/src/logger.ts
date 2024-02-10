/**
 * Enum for log levels
 */
export enum LogLevel {
	DEBUG = 1,
	INFO,
	WARN,
	ERROR,
}

/**
 * Mapping of log levels to console methods
 */
const LogMethod = {
	[LogLevel.DEBUG]: console.debug,
	[LogLevel.INFO]: console.info,
	[LogLevel.WARN]: console.warn,
	[LogLevel.ERROR]: console.error,
};

/**
 * Log Level CLI Colors
 */
const LogLevelColors = {
	[LogLevel.DEBUG]: '\x1b[34m',
	[LogLevel.INFO]: '\x1b[32m',
	[LogLevel.WARN]: '\x1b[33m',
	[LogLevel.ERROR]: '\x1b[31m',
	reset: '\x1b[0m',
};

/**
 * Class for managing debug logging
 * @class
 */
export class Logger {
	/**
	 * @param {boolean} enabled - Whether logging is enabled
	 * @param {LogLevel} level - The maximum log level to display
	 */
	constructor(private enabled: boolean, private level: LogLevel) {}

	/**
	 * Format a message based on its log level
	 * @param {string} message - The message to format
	 * @param {LogLevel} level - The level of the message
	 * @returns {string} - The formatted message
	 */
	private formatMessage(message: string, level: LogLevel): string {
		const timestamp = new Date().toISOString();
		const color = LogLevelColors[level];
		const reset = LogLevelColors.reset;
		return `[${timestamp}] ${color}${LogLevel[level]}${reset}: ${message}`;
	}

	/**
	 * Log a message
	 * @param {string} message - The message to log
	 * @param {LogLevel} level - The level of the message
	 * @returns {void}
	 */
	log(message: string, level: LogLevel): void {
		if (this.enabled && level >= this.level) {
			if (level in LogMethod) {
				LogMethod[level](this.formatMessage(message, level));
			} else {
				throw new Error(`Invalid log level: ${level}`);
			}
		}
	}
}

/**
 * Create a logger instance for other modules to use
 * @param {boolean} enabled - Whether logging is enabled
 * @param {LogLevel} level - The maximum log level to display. It should be a value between 1 and 4, where 1 is for DEBUG, 2 is for INFO, 3 is for WARN, and 4 is for ERROR.
 * @returns {Logger} - The logger instance
 * @throws {Error} If the provided log level is not within the range 1-4
 */
export function createLogger(enabled: boolean, level: LogLevel): Logger {
	if (!(level in LogLevel)) {
		throw new Error(`Invalid log level: ${level}`);
	}
	return new Logger(enabled, level);
}

/**
 * The logger instance with logging enabled and set to DEBUG level
 */
const logger = createLogger(true, LogLevel.DEBUG);

/**
 * Export the log method from the logger instance
 */
export const logMessage = logger.log.bind(logger);
