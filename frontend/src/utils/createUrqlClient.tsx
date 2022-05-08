import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange,  fetchExchange } from "urql";
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql";
import { auxUpdateQuery } from "./auxUpdateQuery";

  // Aclarar en qué consiste bien el cliente de urql
  export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4001/graphql',
    fetchOptions: {
      credentials: 'include' as const, // Incluimos las cookies en las peticiones
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
          },
          logout: (_result, args, cache, info) => {
            auxUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          }
        }
      }
    }), ssrExchange ,fetchExchange]
  })