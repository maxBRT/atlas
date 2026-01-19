#!/usr/bin/env bun

import { initCommand } from './commands/init';
import { webCommand } from './commands/web';

const args = process.argv.slice(2);
const command = args[0];

const showHelp = () => {
    console.log(`
Atlas CLI - A tool for managing your project's planning documents.

Usage:
  atlas <command>

Available Commands:
  init      Initializes a new Atlas project.
  web       Launches the web UI.
  help      Displays help information.
  `);
};

switch (command) {
    case 'init':
        initCommand();
        break;

    case 'web':
        webCommand();
        break;

    case 'help':
    case undefined:
        showHelp();
        break;

    default:
        console.log(`Unknown command: ${command}`);
        showHelp();
        break;
}
