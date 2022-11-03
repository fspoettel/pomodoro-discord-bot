const { replyToMessage } = require('../../lib/discord')
const { issue } = require('../templates')

async function issueCommand ({
  client,
  commands,
  message,
  words
}) {
  return replyToMessage(message, issue())
}

module.exports = issueCommand
