const { replyToMessage } = require('../../lib/discord')

async function motivationCommand ({ client, message, words }) {
  return replyToMessage(message, '💪 https://youtu.be/Z2ik7IRkzFU')
}

module.exports = motivationCommand
