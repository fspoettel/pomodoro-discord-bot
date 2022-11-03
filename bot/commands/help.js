const { help } = require('../templates')
const { replyToMessage } = require('../../lib/discord')

async function helpCommand ({
  client,
  commands: commandsGroups,
  message,
  words
}) {
  const template = commandsGroups
    .reduce((acc, { title, commands }) => {
      const commandStr = commands.map(({ docs, shortcuts }) => {
        return shortcuts.length > 0
          ? `${docs}\n_Shortcuts:_ ${shortcuts.map(s => `\`${s}\``).join(', ')}\n`
          : `${docs}\n`
      }).join('\n')

      return `${acc}\n**${title}**\n\n${commandStr}`
    }, '')

  return replyToMessage(message, help(template))
}

module.exports = helpCommand
