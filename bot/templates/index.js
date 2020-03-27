const { formatDuration, getTypeIcon } = require('../utils')
const packageJson = require('../../package.json')

const { DISCORD_BOT_NAME } = process.env

const templates = {
  clearStats (isToday) {
    return `Time for a fresh start! I cleared ${isToday ? 'your daily' : 'all your'} stats`
  },
  help (commandStr) {
    return `I am a timer bot for the **pomodoro technique**. Issue commands by sending me a direct message or mention me via \`@${DISCORD_BOT_NAME} {command}\`.\n\n**Available Commands**\n${commandStr}`
  },
  notFound (contextPrefix) {
    return `I did not understand that command. 😞 Type \`${contextPrefix}help\` to see a list of available commands.`
  },
  noInProgress (contextPrefix) {
    return `I did not find a 🍅 or ☕ in progress for you. Start a new 🍅 by typing \`${contextPrefix}start\``
  },
  hasProgress (contextPrefix, type) {
    const typeIcon = getTypeIcon(type)
    return `you have a ${typeIcon} in progress. Please use \`${contextPrefix}complete\` to finish the current ${typeIcon} before starting a new one. You can also use \`${contextPrefix}restart\` to restart it`
  },
  issue () {
    return `you can report bugs and request features at **${packageJson.bugs}**`
  },
  reset (duration, type) {
    const typeIcon = getTypeIcon(type)
    return `I restarted your **${formatDuration(duration)}** ${typeIcon}. I will message you once it completes`
  },
  newTimer (duration, type) {
    const typeIcon = getTypeIcon(type)
    const durationStr = `${duration}`
    // @todo use `formatDuration` here
    return `I started a **${durationStr.length === 1 ? '0' : ''}${durationStr} min** ${typeIcon} for you. I will message you once it completes`
  },
  status (timeLeft, type) {
    const typeIcon = getTypeIcon(type)
    return `There are **${timeLeft}** left on your current ${typeIcon}`
  },
  stats ({
    count: {
      break: breakCount,
      interval: intervalCount
    },
    duration: {
      break: breakDuration,
      interval: intervalDuration
    }
  }, isToday) {
    return `you have completed **${intervalCount}** 🍅 _(${formatDuration(intervalDuration)})_ and **${breakCount}** ☕ _(${formatDuration(breakDuration)})_ ${isToday ? 'so far today' : 'in total'}`
  },
  stop (contextPrefix, type) {
    const typeIcon = getTypeIcon(type)
    return `I stopped your ${typeIcon}. You can start a new 🍅 any time by typing \`${contextPrefix}start\``
  },
  breakDone (duration) {
    return `Your **${duration}** ☕ has finished. Type \`start\` to start a new 🍅`
  },
  timerDone (duration) {
    return `Your **${duration}** 🍅 has finished. Type \`short\` or \`long\` to start a break ☕`
  }
}

module.exports = templates
