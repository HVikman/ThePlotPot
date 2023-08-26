const { gql } = require('apollo-server-express')

module.exports = gql`
type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    createStory(title: String!): Story!
    deleteStory(id: ID!): DeleteResponse!
    createChapter(content: String!, storyId: ID!, authorId: ID!): Chapter!
    login(email: String!, password: String!): LoginResponse!
    logout: LogoutResponse!
}
`