const helpCommand = require('./help')
const issueCommand = require('./issue')
const makeBreakCommand = require('./break')
const notFoundCommand = require('./notFound')
const resetCommand = require('./reset')
const startCommand = require('./start')
const statsCommand = require('./stats')
const statusCommand = require('./status')
const stopCommand = require('./stop')

const COMMANDS = [
  {
    docs: '`start {min}` a 🍅 of a given duration, by default `start 25`. I will send you a direct message once it completes',
    handler: startCommand,
    keyword: 'start',
    shortcuts: ['s', 'new']
  },
  {
    docs: '`break {min}` starts a ☕. It is `5` minutes long by default. I will send you a message once it completes',
    handler: makeBreakCommand(5),
    keyword: 'shortbreak',
    shortcuts: ['b', 'short', 'shortbreak']
  },
  {
    docs: '`longbreak {min}` starts a long ☕. It is `30` minutes long by default. I will send you a message once it completes',
    handler: makeBreakCommand(30),
    keyword: 'longbreak',
    shortcuts: ['lb', 'long']
  },
  {
    docs: '`complete` a 🍅 or ☕ in progress',
    handler: stopCommand,
    keyword: 'complete',
    shortcuts: ['c', 'stop']
  },
  {
    docs: '`restart` a 🍅 or ☕ in progress',
    handler: resetCommand,
    keyword: 'restart',
    shortcuts: ['r', 'reset']
  },
  {
    docs: '`timeleft` displays the time left on the current 🍅 or ☕',
    handler: statusCommand,
    keyword: 'timeleft',
    shortcuts: ['t', 'status']
  },
  {
    docs: '`stats {today|total}` displays the amount of 🍅 and ☕ you have completed. By default, `total` stats will be shown',
    handler: statsCommand,
    keyword: 'stats',
    shortcuts: []
  },
  {
    docs: '`help` displays this help again',
    handler: helpCommand,
    keyword: 'help',
    shortcuts: ['h', 'about']
  },
  {
    docs: '`issue` displays a link to the issue tracker for this bot',
    handler: issueCommand,
    keyword: 'issue',
    shortcuts: []
  }
]

function matchCommandHandler (cmdStr) {
  const command = COMMANDS
    .find(({ keyword, shortcuts }) =>
      [keyword, ...shortcuts].some(str => str === cmdStr)
    )

  if (!command) return null
  return command.handler
}

async function commandHandler (client, message) {
  const { content } = message

  const words = content
    .replace(/<@!?.*?>/gm, '')
    .trim()
    .toLowerCase()
    .split(/\s/)

  const cmd = words[0]
  const handler = matchCommandHandler(cmd)

  const handlerArgs = {
    client,
    commands: COMMANDS,
    message,
    words
  }

  if (handler) {
    await handler(handlerArgs)
  } else {
    await notFoundCommand(handlerArgs)
  }
}

module.exports = commandHandler
