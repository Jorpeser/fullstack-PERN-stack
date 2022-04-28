// DUDAS:
// 1. Qué es exactamente ApolloServer? 
// 2. Qué es type-graphql y qué relación tiene con ApolloServer?
// 3. RESUELTO Qué hace exactamente yarn watch (tsc watch) -> Compila el código cada vez que se modifica un archivo?
// 4. Qué son los decorators? (@)
// 5. RESUELTO - Qué es el ORM?
// 6. Qué es el Migrator?
// 7. Qué es el EntityManager?
// 8. Qué es el Entity?
// 9. RESUELTO - Qué es Redis?

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
import { ThreadResolver } from "./resolvers/thread";

import * as redis from 'redis';
import session from 'express-session';
//import { MyContext } from "./types"; 
import connectRedis from 'connect-redis';

// Plugin para el playground de apolo
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import cors from 'cors';


const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up() // runs migrations Necesita explicacion
    
    const app = express();
    
    const RedisStore = connectRedis(session);
    //let RedisStore = require('connect-redis')(session); //-> Se convierte al import de arriba y se llama a la funcion con parametro session.
    const redisClient = redis.createClient();

    redisClient.on('connect', (_) => {
        console.log('Redis client connected');
    })

    app.set('trust proxy', true)

    app.use(
        cors({
          origin: 'http://localhost:3000',
          methods: ['POST', 'GET', 'PUT', 'HEAD', 'OPTIONS'],
          credentials: true,
        })
    );
    
    app.use(
        session({
            name: "micookie", // nombre de la cookie
            secret: "muchapoliciapocadiversion", // firma de la cookie
            store: new RedisStore({ 
                disableTouch: true, // para que no se actualice la cookie cada vez que se haga una petición
                client: redisClient
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
                httpOnly: true, // hace la cookie inaccesible desde el frontend
                secure: false ,//__prod__ // hace que la cookie solo funcione en https
                sameSite: "lax" // csrf (cross site request forgery)
            },
            resave: false,
            saveUninitialized: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver, ThreadResolver],
            validate: false
        }),
        plugins : [
            ApolloServerPluginLandingPageGraphQLPlayground({}) 
        ],
        context: ({req, res}) => ({ em: orm.em, req, res })
    });

    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: false });
    
    app.listen(4001, () => {
        console.log('server started on localhost:4001')
    })
    
};

main().catch((err) => {
    console.log(err)
});