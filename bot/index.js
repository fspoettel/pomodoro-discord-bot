const Sentry = require('@sentry/node')
const { getClient, setPresence } = require('../lib/discord')
const { bindScheduler } = require('./scheduler')
const { isFromBot, isDirectMessage, isMentioned, isPartial } = require('./utils')
const commandHandler = require('./commands')
const { Events } = require('discord.js')

const { DISCORD_BOT_NAME } = process.env

function makeMessageHandler (client) {
  return async (message) => {
    const shouldReact = !isFromBot(message) && !isPartial(message) &&
      (isDirectMessage(message) || isMentioned(message))

    if (!shouldReact) return

    try {
      await commandHandler(client, message)
    } catch (err) {
      console.error(err)
      // @todo try notify admins in case bot is missing permissions (50013)
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
    console.error(err)
    Sentry.captureException(err)
  }

  client.on(Events.MessageCreate, makeMessageHandler(client))

  bindScheduler(client)
}

module.exports = { init }
