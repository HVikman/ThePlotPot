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
const CREATE_STORY = gql`
  mutation CreateStory($title: String!, $description: String!, $genre: String!, $firstChapterContent: String!) {
    createStory(
      input: {
        title: $title, 
        description: $description, 
        genre: $genre, 
        firstChapterContent: $firstChapterContent
      }
    ) {
      success
      message
      story {
        id
      }
    }
  }
`
const GET_ALL_STORIES = gql`
  query GetAllStories {
    getAllStories {
      title
      genre
      description
      id
      author {
        username
      }
    }
  }
`
const GET_STORY_BY_ID = gql`
query GetStory($id: ID!) {
  getStory(id: $id) {
    title
    chapters {
      content
      title
      branch
      id
      parentChapterId
      upvotes
    }
    author {
      username
    }
    description
    genre
    id
  }
}
`
const CREATE_CHAPTER = gql`
mutation CreateChapter($content: String!, $storyId: ID!, $title: String!, $branch: Int!, $parentChapterId: ID!) {
  createChapter(content: $content, storyId: $storyId, title: $title, branch: $branch, parentChapterId: $parentChapterId) {
    id
  }
}
`
export { LOGIN_MUTATION, SIGNUP_MUTATION, LOGOUT_MUTATION,CREATE_STORY,GET_ALL_STORIES,GET_STORY_BY_ID, ME, CREATE_CHAPTER }