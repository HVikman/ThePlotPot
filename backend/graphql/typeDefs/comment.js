const { gql } = require('apollo-server-express')

module.exports = gql`
type Comment {
    id: ID!
    chapterId: Int
    user: User
    content: String!
    createdAt: String
    deletedAt: String
}

input CommentInput {
    chapterId: ID!
    content: String!
}
`