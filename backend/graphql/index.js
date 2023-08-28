const UserResolvers = require('./resolvers/user')
const StoryResolvers = require('./resolvers/story')
const ChapterResolvers = require('./resolvers/chapter')


const UserType = require('./typeDefs/user')
const StoryType = require('./typeDefs/story')
const ChapterType = require('./typeDefs/chapter')
const MutationType = require('./typeDefs/mutation')
const QueryType = require('./typeDefs/query')
const BasicType = require('./typeDefs/basic')

const resolvers = {
  Query: {
    ...UserResolvers.Query,
    ...StoryResolvers.Query,
    ...ChapterResolvers.Query
  },
  Mutation: {
    ...UserResolvers.Mutation,
    ...StoryResolvers.Mutation,
    ...ChapterResolvers.Mutation
  },
  User: UserResolvers.User,
  Story: StoryResolvers.Story,
  Chapter: ChapterResolvers.Chapter
}

const typeDefs = [
  UserType,
  StoryType,
  ChapterType,
  MutationType,
  QueryType,
  BasicType
]

module.exports = {
  resolvers,
  typeDefs
}