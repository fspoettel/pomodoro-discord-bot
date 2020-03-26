const {
  addHours,
  getMinutes,
  getHours,
  getSeconds
} = require('date-fns')

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

function formatDuration (duration) {
  const normalizeTime = time => time.length === 1 ? `0${time}` : time

  const MINUTES_IN_HOUR = 60

  const milliseconds = duration

  const date = new Date(milliseconds)
  const timezoneDiff = date.getTimezoneOffset() / MINUTES_IN_HOUR
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff)

  const hours = normalizeTime(`${getHours(dateWithoutTimezoneDiff)}`)
  const minutes = normalizeTime(`${getMinutes(dateWithoutTimezoneDiff)}`)
  const seconds = normalizeTime(`${getSeconds(dateWithoutTimezoneDiff)}`)

  const hoursOutput = hours !== '00' ? `${hours} h, ` : ''
  const secondsOutput = seconds !== '00' ? `, ${seconds}s` : ''

  return `${hoursOutput}${minutes} min${secondsOutput}`
}

module.exports = {
  formatDuration,
  getContextPrefix,
  getTypeIcon,
  isDirectMessage,
  isFromBot,
  isMentioned,
  parseDuration
}
