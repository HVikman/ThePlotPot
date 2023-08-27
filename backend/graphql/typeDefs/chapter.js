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
    }
`