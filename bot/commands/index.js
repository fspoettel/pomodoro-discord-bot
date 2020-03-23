const { isFromBot, isDirectMessage, isMentioned } = require('../utils')

const helpCommand = require('./help')
const notFoundCommand = require('./notFound')
const startCommand = require('./start')
const stopCommand = require('./stop')
const resetCommand = require('./reset')
const statusCommand = require('./status')

const COMMANDS = [
  ['start', startCommand],
  ['stop', stopCommand],
  ['reset', resetCommand],
  ['status', statusCommand],
  ['help', helpCommand]
]

function matchCommandHandler (commandName) {
  const command = COMMANDS.find(([str]) => str === commandName)
  if (!command) return null
  return command[1]
}

async function commandHandler (client, pomodoro, message) {
  const shouldReact = !isFromBot(message) &&
    (isDirectMessage(message) || isMentioned(message))

  if (!shouldReact) return

  const { content } = message

  const words = content
    .replace(/<@!.*?>/gm, '')
    .trim()
    .toLowerCase()
    .split(/\s/)

  const cmd = words[0]
  const handler = matchCommandHandler(cmd)

  if (handler) {
    await handler({ message, client, pomodoro, words })
  } else {
    await notFoundCommand({ message, client, words })
  }
}

module.exports = commandHandler
