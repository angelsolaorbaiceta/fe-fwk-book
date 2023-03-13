const chalk = require('chalk')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const { init } = require('./init')

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
      console.info(
        '🚀 Initializing the project ' +
          chalk.blue.italic(`${argv.name}` + '...')
      )

      init(argv.name)
        .then(() => {
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
        .catch((err) => {
          console.error(
            '❌ ' +
              chalk.red('Error!') +
              ' Failed to create the new project ' +
              chalk.blue.italic(`${argv.name}`) +
              ` 😢😢😢 (${err})`
          )
        })
    }
  )
  .version('1.0.5')
  .demandCommand()
  .epilog('📖 You can find the book at http://mng.bz/aM2o')
  .parse()
