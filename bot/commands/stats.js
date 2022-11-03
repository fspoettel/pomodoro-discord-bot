const { stats: statsTemplate } = require('../templates')
const { getStats } = require('../../lib/pomodoro')
const { replyToMessage } = require('../../lib/discord')

async function statsCommand ({
  client,
  message,
  words
}) {
  const { author } = message
  const isToday = words.includes('today')
  const stats = await getStats(author.id, isToday ? 'daily' : 'total')
  return replyToMessage(message, statsTemplate(stats, isToday))
}

module.exports = statsCommand
