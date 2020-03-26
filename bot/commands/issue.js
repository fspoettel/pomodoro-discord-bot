const { issue } = require('../templates')

async function issueCommand ({
  client,
  commands,
  message,
  words
}) {
  return message.reply(issue())
}

module.exports = issueCommand
