const Sentry = require('@sentry/node')
const { getClient, setPresence } = require('../lib/discord')
const { bindScheduler } = require('./scheduler')
const { isFromBot, isDirectMessage, isMentioned } = require('./utils')
const commandHandler = require('./commands')

const { DISCORD_BOT_NAME } = process.env

function makeMessageHandler (client) {
  return async function messageHandler (message) {
    const shouldReact = !isFromBot(message) &&
      (isDirectMessage(message) || isMentioned(message))

    if (!shouldReact) return

    try {
      await commandHandler(client, message)
    } catch (err) {
      Sentry.captureException(err)
    }
  }
}

async function init () {
  // Top-level init() will exit and log if this fails
  const client = await getClient()

  try {
    await setPresence(client, `@${DISCORD_BOT_NAME} help`)
  } catch (err) {
    Sentry.captureException(err)
  }

  client.on('message', makeMessageHandler(client))
  bindScheduler(client)
}

module.exports = { init }
