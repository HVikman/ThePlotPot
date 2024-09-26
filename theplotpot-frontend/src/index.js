import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { AuthProvider } from './pages/auth/AuthContext'
import { NotificationsProvider } from './components/NotificationsContext'
import { DarkModeProvider } from './components/DarkModeContext'
import { setContext } from '@apollo/client/link/context'
import 'bootstrap/dist/css/bootstrap.css'

const getCsrfToken = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))
  return token ? token.split('=')[1] : null
}

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include'
})

const authLink = setContext((_, { headers }) => {
  const csrfToken = getCsrfToken()
  return {
    headers: {
      ...headers,
      'X-CSRF-Token': csrfToken
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <NotificationsProvider>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
)