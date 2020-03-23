const { help } = require('../templates')

async function helpCommand ({ client, message, words }) {
  return message.reply(help())
}

module.exports = helpCommand
