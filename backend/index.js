const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
//const morgan = require('morgan')
const app = express()
//app.use(morgan('combined'))
const dotenv = require('dotenv')
dotenv.config()

app.use(session({
  store: new SQLiteStore(),
  name: 'plotpot_sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))

const { resolvers, typeDefs } = require('./graphql')
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    console.log('ApolloServer context creation:', req.session)
    return {
      req,
      res,
      user: req.session ? req.session.user : null
    }}
})

; (async () => {
  await server.start()
  server.applyMiddleware({ app, path: '/graphql' })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`)
  })
})()