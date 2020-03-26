const { clearStats: clearStatsTemplate } = require('../templates')
const { clearStats } = require('../../lib/pomodoro')

async function clearStatsCommand ({
  client,
  message,
  words
}) {
  const { author } = message
  const isToday = words.includes('today')
  await clearStats(author.id, isToday ? 'daily' : 'total')
  return message.reply(clearStatsTemplate(isToday))
}

module.exports = clearStatsCommand
