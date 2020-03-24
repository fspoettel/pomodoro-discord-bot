const { help } = require('../templates')

async function helpCommand ({
  client,
  commands,
  message,
  words
}) {
  const template = commands
    .map(({ docs, keyword, shortcuts }) =>
      `- ${docs}\n _Shortcuts:_ ${shortcuts.map(s => `\`${s}\``).join(', ')}\n`
    )
    .join('\n')

  return message.reply(help(template))
}

module.exports = helpCommand
