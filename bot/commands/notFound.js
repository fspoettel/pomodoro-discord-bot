const { replyToMessage } = require('../../lib/discord')
const { notFound } = require('../templates')
const { getContextPrefix } = require('../utils')

async function notFoundCommand ({ client, message, words }) {
  const contextPrefix = getContextPrefix(message)
  return replyToMessage(message, notFound(contextPrefix))
}

module.exports = notFoundCommand
