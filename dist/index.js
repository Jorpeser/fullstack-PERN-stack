"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const thread_1 = require("./resolvers/thread");
const redis = __importStar(require("redis"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const apollo_server_core_1 = require("apollo-server-core");
const cors_1 = __importDefault(require("cors"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = redis.createClient();
    redisClient.on('connect', (_) => {
        console.log('Redis client connected');
    });
    app.set('trust proxy', true);
    app.use((0, cors_1.default)({
        origin: '*',
        methods: ['POST', 'GET', 'PUT', 'HEAD', 'OPTIONS'],
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: "micookie",
        secret: "muchapoliciapocadiversion",
        store: new RedisStore({
            disableTouch: true,
            client: redisClient
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 1,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        },
        resave: false,
        saveUninitialized: false
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [post_1.PostResolver, user_1.UserResolver, thread_1.ThreadResolver],
            validate: false
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({})
        ],
        context: ({ req, res }) => ({ em: orm.em, req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4001, () => {
        console.log('server started on localhost:4001');
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map