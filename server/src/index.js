const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../../../h2chain-datamodel/server/hr/src/generated/prisma-client')
const resolvers = require('./resolvers')

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma
  })
})

server.start(() => console.log('Server is running on http://localhost:4000'))
