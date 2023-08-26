const { gql } = require('apollo-server-express')

module.exports = gql`
    type Story {
    id: ID!
    title: String!
    author: User!
    chapters: [Chapter]
    }
`