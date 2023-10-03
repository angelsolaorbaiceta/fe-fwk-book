const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const { init } = require('./init.cjs')
const { version } = require('../package.json')

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
      console.info(`🚀 Initializing the project ${argv.name}...`)

      init(argv.name)
        .then(() => {
          console.info(
            `✅ Success! Created the new project ${argv.name} 🎉🎉🎉`
          )
          console.info(
            '\nYou can now cd into the project and install the dependencies:'
          )
          console.info(`\t$ cd ${argv.name}`)
          console.info(`\t$ npm install`)
          console.info('\n📖 Enjoy reading the book!')
          console.info(
            '📦 Buy your copy at http://mng.bz/aM2o and start learning now!'
          )
        })
        .catch((err) => {
          console.error(
            `❌ Error! Failed to create the new project ${argv.name} 😢😢😢 (${err})`
          )
        })
    }
  )
  .version(version)
  .demandCommand()
  .epilog('📖 You can find the book at http://mng.bz/aM2o')
  .parse()
