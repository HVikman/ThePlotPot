const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const session = require('express-session')
const RedisStore = require('connect-redis').default
const { createClient } = require('redis')

const path = require('path')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const app = express()
const dotenv = require('dotenv')
dotenv.config()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // limit each IP to 200 requests per windowMs
})

let redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASS
})
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
  client: redisClient
})

app.use(limiter)

const scheduleChapterCountsUpdate = require('./db/batchJobs')
scheduleChapterCountsUpdate()

app.set('trust proxy', 1)
app.use(session({
  store: redisStore,
  name: 'plotpot_sid',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain: process.env.DOMAIN,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})
app.use(express.static('dist'))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

if(process.env.NODE_ENV === 'production'){
  const corsOptions = {
    origin: 'https://theplotpot.onrender.com/',
    methods: 'POST',
  }
  app.use('/graphql', cors(corsOptions))
}

const { resolvers, typeDefs } = require('./graphql')
const server = new ApolloServer({
  persistedQueries: false,
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error)
    const isUserError = error.originalError && error.originalError.isUserError
    if (process.env.NODE_ENV !== 'development' && !isUserError) {
      //Hide the message for internal errors
      return new Error('Internal server error')
    }
    return error
  }
  ,
  context: async ({ req, res }) => {
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