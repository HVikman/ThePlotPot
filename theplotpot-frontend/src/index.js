import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { AuthProvider } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { DarkModeProvider } from './context/DarkModeContext'
import { setContext } from '@apollo/client/link/context'
import { App as AntdApp } from 'antd'
import 'bootstrap/dist/css/bootstrap.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const getCsrfToken = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
  return token ? decodeURIComponent(token.split('=')[1]) : null
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
    <AntdApp>
      <ApolloProvider client={client}>
        <AuthProvider>
          <NotificationsProvider>
            <DarkModeProvider>
              <App />
            </DarkModeProvider>
          </NotificationsProvider>
        </AuthProvider>
      </ApolloProvider>
    </AntdApp>
  </React.StrictMode>
)

serviceWorkerRegistration.register()