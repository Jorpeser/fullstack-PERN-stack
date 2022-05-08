// Configuración de chakra-ui
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'

function MyApp({ Component, pageProps }: any) {
  return (

    // Encapsulamos toda la aplicación  en un Provider de urql para que 
    // cada componente y elemento dentro del provider pueda usar 
    // queries de GraphQL

    <ChakraProvider resetCSS theme={theme}>

      <Component {...pageProps} />

    </ChakraProvider>

  )
}

export default MyApp
