import chalk from 'chalk';

export default class Logger {
    /*
     * Debugging & Tracing (STDOUT)
     */
    static trace(message) {
        console.log(chalk.gray(Logger.format(message)));
    };

    static debug(message) {
        console.log(chalk.magentaBright(Logger.format(message)));
    };

    /*
     * Information & Success (STDOUT)
     */
    static info(message) {
        console.info(chalk.cyanBright(Logger.format(message)));
    };

    static success(message) {
        console.info(chalk.greenBright(Logger.format(message)));
    };

    /*
     * Warnings & Errors (STDERR)
     */
    static warn(message) {
        console.warn(chalk.yellowBright(Logger.format(message)));
    };

    static error(message) {
        console.error(chalk.redBright(Logger.format(message)));
    };

    static format (message) {
        return `[certgen] [${new Date().toISOString()}] ${message}`;
    };
}