/*
 * SPDX-License-Identifier: Apache-2.0
 */

import colors from 'colors';

export default class Logger {
    /*
     * Basic Loggging (STDOUT)
     */
    static log(message: string) {
        console.log(message);
    }

    static dir(message: string) {
        console.dir(message);
    }

    /*
     * Debugging & Tracing (STDOUT)
     */
    static trace(message: string) {
        console.log(colors.gray(message));
    };

    static debug(message: string) {
        console.log(colors.magenta(message));
    };

    /*
     * Information & Success (STDOUT)
     */
    static info(message: string) {
        console.info(colors.cyan(message));
    };

    static success(message: string) {
        console.info(colors.green(message));
    };

    /*
     * Warnings & Errors (STDERR)
     */
    static warn(message: string) {
        console.warn(colors.yellow(message));
    };

    static error(message: string) {
        console.error(colors.red(message));
    };
}
