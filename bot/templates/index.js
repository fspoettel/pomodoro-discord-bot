const { DISCORD_BOT_NAME } = process.env

const templates = {
  help (commandStr) {
    return `I am a timer bot for the **pomodoro technique**. Issue commands by sending me a direct message or mention me via \`@${DISCORD_BOT_NAME}\`.

  **Available Commands**\n\n${commandStr}`
  },
  notFound (contextPrefix) {
    return `I did not understand that command. 😞 Type \`${contextPrefix}help\` to see a list of available commands.`
  },
  noInProgress (contextPrefix) {
    return `I did not find a 🍅 in progress for you. Start a new one by typing \`${contextPrefix}start\``
  },
  hasProgress (contextPrefix) {
    return `you have a 🍅 in progress. Please use \`${contextPrefix}stop\` to finish the current timer before starting a new one. You can also use \`${contextPrefix} reset\` to reset the current 🍅`
  },
  reset (duration) {
    return `I reset your **${duration} min** 🍅. I will message you once the new timer completes`
  },
  start (duration) {
    return `I started a **${duration} min** 🍅 for you. I will message you once the timer completes`
  },
  status (timeLeft) {
    return `There are **${timeLeft}** minutes left on your current 🍅`
  },
  stop (contextPrefix) {
    return `I stopped your 🍅. You can start another one any time by typing \`${contextPrefix}start\``
  },
  timerDone (duration) {
    return `Your **${duration} min** 🍅 has finished. Time for a break ☕`
  }
}

module.exports = templates
