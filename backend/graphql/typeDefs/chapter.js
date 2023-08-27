const { gql } = require('apollo-server-express')

module.exports = gql`
    type Chapter {
    id: ID!
    content: String!
    Title: String
    story: Story!
    parentChapter: ID
    branch: Int!
    upvotes: Int
    }
`