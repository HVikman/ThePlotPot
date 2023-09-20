const { gql } = require('apollo-server-express')

module.exports = gql`
    type Chapter {
    id: ID!
    content: String!
    title: String
    story: Story!
    parentChapterId: ID
    branch: Int!
    upvotes: Int
    author: User!
    reads_count: Int
    votes_count: Int
    }
`