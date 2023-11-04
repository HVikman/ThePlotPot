const UserResolvers = require('./resolvers/user')
const StoryResolvers = require('./resolvers/story')
const ChapterResolvers = require('./resolvers/chapter')
const CommentResolvers = require('./resolvers/comment')


const UserType = require('./typeDefs/user')
const StoryType = require('./typeDefs/story')
const ChapterType = require('./typeDefs/chapter')
const MutationType = require('./typeDefs/mutation')
const QueryType = require('./typeDefs/query')
const BasicType = require('./typeDefs/basic')
const CommentType = require('./typeDefs/comment')

const resolvers = {
  Query: {
    ...UserResolvers.Query,
    ...StoryResolvers.Query,
    ...ChapterResolvers.Query,
    ...CommentResolvers.Query
  },
  Mutation: {
    ...UserResolvers.Mutation,
    ...StoryResolvers.Mutation,
    ...ChapterResolvers.Mutation,
    ...CommentResolvers.Mutation
  },
  User: UserResolvers.User,
  Story: StoryResolvers.Story,
  Chapter: ChapterResolvers.Chapter,
  Comment: CommentResolvers.Comment
}

const typeDefs = [
  UserType,
  StoryType,
  ChapterType,
  MutationType,
  QueryType,
  BasicType,
  CommentType
]

module.exports = {
  resolvers,
  typeDefs
}