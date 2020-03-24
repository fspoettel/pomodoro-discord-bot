const { help } = require('../templates')

async function helpCommand ({
  client,
  commands,
  message,
  words
}) {
  const template = commands
    .map(({ docs, keyword, shortcuts }) =>
      `- ${docs}\n Shortcuts: \`${shortcuts.join(', ')}\``
    )
    .join('\n')

  return message.reply(help(template))
}

module.exports = helpCommand
