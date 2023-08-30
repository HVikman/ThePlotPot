const { gql } = require('apollo-server-express')

module.exports = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        coffee: String
        stories: [Story]
    }
    type LoginResponse {
        success: Boolean!
        message: String!
        user: User
    }
    type SignupResponse {
        success: Boolean!
        message: String!
        user: User
    }
`