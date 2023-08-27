const { gql } = require('apollo-server-express')

module.exports = gql`
    type Story {
    id: ID!
    title: String!
    genre: String!
    description: String
    author: User!
    chapters: [Chapter]
    }
    input CreateStoryInput {
        title: String!
        description: String!
        genre: String!
        firstChapterContent: String!
      }
      
      type StoryResponse {
        success: Boolean!
        message: String!
        story: Story
      }
`