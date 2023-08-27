const { gql } = require('apollo-server-express')

module.exports = gql`
type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createStory(input: CreateStoryInput!): StoryResponse!
    deleteStory(id: ID!): DeleteResponse!
    createChapter(content: String!, storyId: ID!, title: String!, branch: Int!, parentChapterId: ID!): Chapter!
    login(email: String!, password: String!): LoginResponse!
    logout: LogoutResponse!
}
`