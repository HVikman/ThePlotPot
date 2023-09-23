import { gql } from '@apollo/client'

const SIGNUP_MUTATION = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
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

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        message
        success
        user {
          id
          username
          email
          coffee
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
      coffee
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
        title
        genre
        description
        id
        author {
          username
          coffee
        }
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
        coffee
      }
    }
  }
`
const GET_STORY_BY_ID = gql`
query GetStory($id: ID!, $chapterId: ID) {
  getStory(id: $id, chapterId: $chapterId) {
    title
    chapters {
      content
      title
      branch
      id
      parentChapterId
      upvotes
      author{
        username
        coffee
      }
      reads_count
      votes_count
    }
    author {
      username
      coffee
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
    branch
    content
    id
    parentChapterId
    title
    upvotes
    author {
      username
      coffee
    }
  }
}
`

const GET_CHAPTER_CHILDREN = gql `
  query GetChapterChildren($id: ID!) {
    getChapterChildren(id: $id) {
      id
      content
      title
      parentChapterId
      branch
      upvotes
      author {
        username
        coffee
      }
      reads_count
      votes_count
    }
  }
`
const GET_CHAPTER = gql `
query GetChapter($getChapterId: ID!) {
  getChapter(id: $getChapterId) {
    author {
      coffee
      username
    }
    content
    branch
    parentChapterId
    reads_count
    title
    votes_count
    id
  }
}
`
const EDIT_COFFEE= gql `
mutation EditCoffee($link: String!) {
  editCoffee(link: $link) {
    message
    success
  }
}
`
const CHANGE_PASSWORD = gql `
mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    message
    success
  }
}
`
const LIKE_CHAPTER = gql `
mutation likeChapter($id: ID!) {
  likeChapter(id: $id) {
    message
    success
  }
}
`

const UNLIKE_CHAPTER = gql `
mutation unlikeChapter($id: ID!) {
  unlikeChapter(id: $id) {
    message
    success
  }
}
`

const IS_CHAPTER_LIKED = gql`
query IsChapterLiked($id: ID!) {
  isChapterLiked(id: $id) 
}
`
export { LOGIN_MUTATION, GET_CHAPTER, IS_CHAPTER_LIKED, SIGNUP_MUTATION, LOGOUT_MUTATION,CREATE_STORY,GET_ALL_STORIES,GET_STORY_BY_ID, ME, CREATE_CHAPTER, GET_CHAPTER_CHILDREN,EDIT_COFFEE,CHANGE_PASSWORD,LIKE_CHAPTER,UNLIKE_CHAPTER }