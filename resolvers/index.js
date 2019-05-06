const { query } = require('./query/query')
const { auth } = require('./mutation/auth')
const { order } = require('./mutation/order')
const { template } = require('./mutation/template')
module.exports = {
  Query: query,
  Mutation: {
    ...auth,
    ...order,
    ...template
  }
}
