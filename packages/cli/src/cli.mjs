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
        console.info(`Created the new project "${argv.name}"`)
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
