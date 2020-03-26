const { help } = require('../templates')

async function helpCommand ({
  client,
  commands,
  message,
  words
}) {
  const template = commands
    .map(({ docs, keyword, shortcuts }) => {
      return shortcuts.length > 0
        ? `${docs}\n_Shortcuts:_ ${shortcuts.map(s => `\`${s}\``).join(', ')}\n`
        : `${docs}\n`
    })
    .join('\n')

  return message.reply(help(template))
}

module.exports = helpCommand
