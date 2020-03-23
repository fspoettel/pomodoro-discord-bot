const { DISCORD_CLIENT_ID } = process.env

function isDirectMessage (message) {
  const { channel } = message
  return channel.type === 'dm'
}

function isFromBot (message) {
  const { author } = message
  return author.bot
}

function isMentioned (message) {
  const { mentions } = message
  return !mentions.everyone && mentions.has(DISCORD_CLIENT_ID)
}

function getContextPrefix (message) {
  return isDirectMessage(message) ? '' : '@pomodoro '
}

module.exports = {
  getContextPrefix,
  isDirectMessage,
  isFromBot,
  isMentioned
}
