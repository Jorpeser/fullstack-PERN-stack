// DUDAS:
// 1. Qué es exactamente ApolloServer? 
// 2. Qué es type-graphql y qué relación tiene con ApolloServer?
// 3. Qué hace exactamente yarn watch (tsc watch)
// 4. Qué son los decorators? (@)
// 5. Qué es el ORM?
// 6. Qué es el Migrator?
// 7. Qué es el EntityManager?
// 8. Qué es el Entity?

// Main file del server
import { __prod__ } from "./constants";

import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config"

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata'; // Para type-graph-ql
import { buildSchema } from 'type-graphql';

import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up() // runs migrations Necesita explicacion
    
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        })
    });

    await apolloServer.start()
    apolloServer.applyMiddleware({ app });
    
    app.listen(4001, () => {
        console.log('server started on localhost:4001')
    })
    
};

main().catch((err) => {
    console.log(err)
});
