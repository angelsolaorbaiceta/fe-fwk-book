#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command(
    'init [port]',
    'Initialize an empty starter project for you to write the framework code',
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
  .parse()

console.log("I don't do much yet.")
