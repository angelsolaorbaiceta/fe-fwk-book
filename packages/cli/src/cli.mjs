#!/usr/bin/env node

import chalk from 'chalk'
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
        console.info(
          '✅ ' +
            chalk.green('Success!') +
            ' Created the new project ' +
            chalk.blue.italic(`${argv.name}`) +
            ' 🎉🎉🎉'
        )
        console.info(
          '\nYou can now cd into the project and install the dependencies:'
        )
        console.info(chalk.blue(`\t$ cd ${argv.name}`))
        console.info(chalk.blue(`\t$ npm install`))
        console.info('\n📖 Enjoy reading the book!')
        console.info(
          '📦 ' +
            chalk.magenta.italic(
              'Buy your copy at http://mng.bz/aM2o and start learning now!'
            )
        )
      })
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .demandCommand()
  .epilog('You can find the book at http://mng.bz/aM2o')
  .parse()
