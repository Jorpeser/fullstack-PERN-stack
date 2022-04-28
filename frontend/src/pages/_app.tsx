// Configuración de chakra-ui

import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { Provider, createClient } from 'urql'

// Encapsulamos toda la aplicación  en un Provider de urql para que 
// cada componente y elemento dentro del provider pueda usar 
// queries de GraphQL

import theme from '../theme'

const client = createClient({
  url: 'http://localhost:4001/graphql',
  fetchOptions: {
    credentials: 'include', // Incluimos las cookies en las peticiones
  }
})

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>

        <Component {...pageProps} />

      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
