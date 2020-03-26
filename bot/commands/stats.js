const { stats: statsTemplate } = require('../templates')
const { getStats } = require('../../lib/pomodoro')

async function statsCommand ({
  client,
  message,
  words
}) {
  const { author } = message
  const isToday = words.includes('today')
  const stats = await getStats(author.id, isToday ? 'daily' : 'total')
  return message.reply(statsTemplate(stats, isToday))
}

module.exports = statsCommand
