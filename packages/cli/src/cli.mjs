#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
  .scriptName('fe-fwk')
  .usage('$0 <cmd> [args]')
  .command(
    'init [port]',
    'Initialize an empty starter project for you to write the code for your framework',
    (yargs) => {
      return yargs.positional('port', {
        describe: 'port to bind on',
        default: 5000,
      })
    },
    (argv) => {
      if (argv.verbose) console.info(`start server on :${argv.port}`)
      serve(argv.port)
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .help()
  .parse()

console.log("I don't do much yet.")
