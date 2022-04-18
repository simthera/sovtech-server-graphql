import { ApolloServer } from 'apollo-server'
import { schema } from './schema/schema'
import { dataSources } from './dataSource/dataSource'

const server = new ApolloServer({ schema, dataSources })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
