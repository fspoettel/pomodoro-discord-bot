require('dotenv').config()
const Sentry = require('@sentry/node')
const { init: initBot } = require('./bot')

const { SENTRY_DSN } = process.env

Sentry.init({ dsn: SENTRY_DSN })
initBot()
