// Configuración de chakra-ui

import { ChakraProvider } from '@chakra-ui/react'
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache'
import { Provider, createClient, fetchExchange, dedupExchange } from 'urql'
import { LoginMutation, MeDocument, MeQuery, Query, RegisterMutation } from '../generated/graphql'
import theme from '../theme'

// Revisar y estudiar bien que hace esta función 3:30:00 benawad
function auxUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any);
}

// Aclarar en qué consiste bien el cliente de urql
const client = createClient({
  url: 'http://localhost:4001/graphql',
  fetchOptions: {
    credentials: 'include', // Incluimos las cookies en las peticiones
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          auxUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.login.errors) {
                return query;
              } else {
                return {
                  me: result.login.user
                }
              }
            }
          );
        },
        register: (_result, args, cache, info) => {
          auxUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query;
              } else {
                return {
                  me: result.register.user
                }
              }
            }
          );
        }
      }
    }
  }), fetchExchange]
})

function MyApp({ Component, pageProps }: any) {
  return (

    // Encapsulamos toda la aplicación  en un Provider de urql para que 
    // cada componente y elemento dentro del provider pueda usar 
    // queries de GraphQL
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>

        <Component {...pageProps} />

      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
