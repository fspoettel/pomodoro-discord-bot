const Discord = require('discord.js')

const { DISCORD_BOT_TOKEN } = process.env

async function getClient () {
  const client = new Discord.Client()

  await client.login(DISCORD_BOT_TOKEN)
  return client
}

async function setPresence (client, name, status = 'online') {
  const { user } = client

  return user.setPresence({
    activity: { name },
    status: 'online'
  })
}

async function sendUserDm (client, id, message) {
  const user = new Discord.User(client, { id })
  return user.send(message)
}

module.exports = { getClient, setPresence, sendUserDm }
