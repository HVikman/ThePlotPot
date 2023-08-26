const { gql } = require('apollo-server-express')

module.exports = gql`
type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    getStory(id: ID!): Story
    getAllStories: [Story]
    getChapter(id: ID!): Chapter
    getAllChapters: [Chapter]
}
`