#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import init from './init.mjs'

yargs(hideBin(process.argv))
  .scriptName('fe-fwk')
  .usage('$0 <cmd> [args]')
  .command(
    'init <name>',
    'Initialize an empty starter project with the given name where you can write the code for your framework',
    (yargs) => {
      return yargs.positional('name', {
        describe: 'name of the framework',
        type: 'string',
      })
    },
    (argv) => {
      if (argv.verbose) {
        console.info(`Creating the new project "${argv.name}"...`)
      }
      init(argv.name).then(() => {
        // TODO: use chalk to produce colorful output
        console.info(`Created the new project "${argv.name}"`)
        console.info(
          'You can now cd into the project and run `npm install` to install the dependencies.'
        )
        console.info('Enjoy reading the book!')
      })
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .demandCommand()
  .epilog('You can find the book at ...')
  .parse()
