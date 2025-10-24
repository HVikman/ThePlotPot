const { gql } = require('apollo-server-express')

module.exports = gql`
    type Story {
    id: ID!
    title: String!
    genre: String!
    description: String
    author: User!
    total_chapters: Int!
    read_count: Int!
    createdAt: String!
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