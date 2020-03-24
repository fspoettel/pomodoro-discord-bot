const { getClient, setPresence } = require('../lib/discord')
const { Pomodoro } = require('../lib/pomodoro')
const { bindScheduler } = require('./scheduler')
const { isFromBot, isDirectMessage, isMentioned } = require('./utils')
const commandHandler = require('./commands')

const { DISCORD_BOT_NAME } = process.env

function makeMessageHandler (client, pomodoro) {
  return async function messageHandler (message) {
    const shouldReact = !isFromBot(message) &&
      (isDirectMessage(message) || isMentioned(message))

    if (!shouldReact) return

    try {
      await commandHandler(client, pomodoro, message)
    } catch (err) {
      // @todo handle error
      console.error(err)
    }
  }
}

async function init () {
  let client

  try {
    client = await getClient()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  const pomodoro = new Pomodoro()

  try {
    await setPresence(client, `@${DISCORD_BOT_NAME} help`)
  } catch (err) {
    console.error(err)
  }

  client.on('message', makeMessageHandler(client, pomodoro))
  bindScheduler(client, pomodoro)
}

module.exports = { init }
