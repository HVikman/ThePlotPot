import { gql } from '@apollo/client'

const SIGNUP_MUTATION = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      email
      id
      username
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        message
        success
        user {
          id
          username
          email
        }
      }
  }
`
const LOGOUT_MUTATION = gql`
mutation Logout {
  logout {
      success
      message
  }
}
`

const ME = gql `
query Me {
  me {
      id
      username
      email
  }
}

`

export { LOGIN_MUTATION, SIGNUP_MUTATION, LOGOUT_MUTATION, ME }