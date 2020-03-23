const { notFound } = require('../templates')
const { getContextPrefix } = require('../utils')

async function notFoundCommand ({ client, message, words }) {
  const contextPrefix = getContextPrefix(message)
  return message.reply(notFound(contextPrefix))
}

module.exports = notFoundCommand
