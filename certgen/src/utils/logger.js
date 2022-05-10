import chalk from 'chalk';

export default class Logger {
    /*
     * Basic Loggging (STDOUT)
     */
    static log(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.log(chalk.whiteBright(message));
    }

    /*
     * Debugging & Tracing (STDOUT)
     */
    static trace(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.log(chalk.gray(message));
    };

    static debug(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.log(chalk.magentaBright(message));
    };

    /*
     * Information & Success (STDOUT)
     */
    static info(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.info(chalk.cyanBright(message));
    };

    static success(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.info(chalk.greenBright(message));
    };

    /*
     * Warnings & Errors (STDERR)
     */
    static warn(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.warn(chalk.yellowBright(message));
    };

    static error(message, timestamp = true) {
        if (timestamp) {
            message = Logger.addTimestamp(message);
        }
        console.error(chalk.redBright(message));
    };

    /*
     * Private Functions
     */
    static addTimestamp (message) {
        return `[certgen] [${new Date().toISOString()}] ${message}`;
    };
}