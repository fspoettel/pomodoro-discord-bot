const { DISCORD_BOT_NAME, DISCORD_CLIENT_ID } = process.env

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
  return isDirectMessage(message) ? '' : `@${DISCORD_BOT_NAME} `
}

function isInt (num) {
  return num && !Number.isNaN(Number.parseInt(num, 10))
}

function parseDuration (str, defaultVal = 25) {
  if (!str) return defaultVal
  const numChars = str.replace(/\D/gm, '')
  if (isInt(numChars)) return Number.parseInt(numChars, 10)
  return defaultVal
}

function getTypeIcon (type) {
  return type === 'break' ? '☕' : '🍅'
}

module.exports = {
  getContextPrefix,
  getTypeIcon,
  isDirectMessage,
  isFromBot,
  isMentioned,
  parseDuration
}
