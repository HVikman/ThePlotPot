const { gql } = require('apollo-server-express')

module.exports = gql`
type Mutation {
    createUser(username: String!, email: String!, password: String!): SignupResponse!
    createStory(input: CreateStoryInput!): StoryResponse!
    changePassword(oldPassword: String!, newPassword: String!):Response!
    editCoffee(link:String!):Response!
    deleteStory(id: ID!): Response!
    deleteChapter(id: ID!): Response!
    createChapter(content: String!, storyId: ID!, title: String!, branch: Int!, parentChapterId: ID!): Chapter!
    login(email: String!, password: String!): LoginResponse!
    logout: Response!
}
`