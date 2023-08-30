const { gql } = require('apollo-server-express')

module.exports = gql`
type Response {
    success: Boolean!
    message: String!
}
`