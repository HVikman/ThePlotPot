const { gql } = require('apollo-server-express')

module.exports = gql`
type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    getStory(id: ID!, chapterId: ID): Story
    getAllStories: [Story]
    getChapter(id: ID!): Chapter
    getChapterChildren(id: ID!): [Chapter]
    getAllChapters: [Chapter]
    me: User
    isChapterLiked(id: ID!): Boolean!
    getUserProfile(id: ID!): UserProfile!
}
`