const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)


const app = express()
const dotenv = require('dotenv')
dotenv.config()

const scheduleChapterCountsUpdate = require('./db/batchJobs')
scheduleChapterCountsUpdate()

app.use(session({
  store: new SQLiteStore(),
  name: 'plotpot_sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))
app.use(express.static('dist'))

const { resolvers, typeDefs } = require('./graphql')
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
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