const { Client, GatewayIntentBits, Partials, User, ActivityType } = require('discord.js')
const { isDirectMessage } = require('../bot/utils')

const { DISCORD_BOT_TOKEN } = process.env

async function getClient () {
  const client = new Client({
    allowedMentions: {
      parse: ['users'],
      repliedUser: true
    },
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel, Partials.Message]
  })

  await client.login(DISCORD_BOT_TOKEN)
  return client
}

async function setPresence (client, name, status = 'online') {
  const { user } = client

  if (!user) {
    throw new Error('client does not have a user associated with it.')
  }

  return user.setPresence({
    activities: [{
      name,
      type: ActivityType.Playing
    }],
    status: 'online'
  })
}

/**
 * @param {Client}
 */
async function sendUserDm (client, id, message) {
  const user = new User(client, { id })
  return user.send(message)
}

/**
 * Uses a mention to reply to a user (to skip a privileged intent requirement).
 */
function replyToMessage (message, content) {
  return message.channel.send(
    isDirectMessage(message) ? content : `${message.author} ${content}`
  )
}

module.exports = {
  getClient,
  setPresence,
  sendUserDm,
  replyToMessage
}
