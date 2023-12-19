const { gql } = require('apollo-server-express')

module.exports = gql`
type Mutation {
    createUser(username: String!, email: String!, password: String!, token: String!): SignupResponse!
    createStory(input: CreateStoryInput!, token: String!): StoryResponse!
    changePassword(oldPassword: String!, newPassword: String!):Response!
    editCoffee(link:String!):Response!
    deleteStory(id: ID!): Response!
    deleteChapter(id: ID!): Response!
    createChapter(content: String!, storyId: ID!, title: String!, branch: Int!, parentChapterId: ID!, token: String!): Chapter!
    login(email: String!, password: String!): LoginResponse!
    logout: Response!
    likeChapter(id: ID!): Response!
    unlikeChapter(id: ID!): Response!
    addComment(input: CommentInput!, token: String!): Comment!
    editComment(commentId: ID!, content: String!): Response!
    deleteComment(commentId: ID!): Response!
    banUser(id: ID!): Response!
    unbanUser(id: ID!): Response!
}
`