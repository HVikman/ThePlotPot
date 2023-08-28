const { gql } = require('apollo-server-express')

module.exports = gql`
type DeleteResponse {
    success: Boolean!
    message: String!
}
`