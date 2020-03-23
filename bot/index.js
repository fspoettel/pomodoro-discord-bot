const { getClient, setPresence } = require('../lib/discord')
const { Pomodoro } = require('../lib/pomodoro')
const { bindScheduler } = require('./scheduler')
const commandHandler = require('./commands')

function makeMessageHandler (client, pomodoro) {
  return async function messageHandler (message) {
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
    process.exit(1)
  }

  const pomodoro = new Pomodoro()

  try {
    await setPresence(client, '@pomodoro help')
  } catch (err) {
    console.error(err)
  }

  client.on('message', makeMessageHandler(client, pomodoro))
  bindScheduler(client, pomodoro)
}

module.exports = { init }
