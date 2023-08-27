import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'


const httpLink = new HttpLink({
  uri: '/graphql',
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: 'include'
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}><App /></ApolloProvider>

  </React.StrictMode>
)
