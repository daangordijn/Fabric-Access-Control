#!/usr/bin/env node

import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import * as commander from 'commander';

import { inspectCertificate } from './commands/inspect.js'
import { registerCertificate } from './commands/register.js'

clear();

const program = new commander.Command();

// Update CLI Version
program.version('1.0.0', undefined, 'Output the version number');

// Update CLI Help Commands
program.helpOption(undefined, 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

program.addHelpText('beforeAll',
    chalk.cyanBright(figlet.textSync('CERTGEN CLI', { horizontalLayout: 'true' }))
);

// Update CLI Error Handling
program.showHelpAfterError();

/*
 * Command: 'certgen inspect'
 */
program
    .command('inspect <path>')
    .description('Inspect the specified certificate')
    .action(inspectCertificate);

/*
 * Command: 'certgen register'
 */
program
    .command('register <name>')
    .description('Register a new client certificate')
    .action(registerCertificate);

// Parse Commander CLI
program.parse(process.argv);