import { __prod__ } from "./constants";
import path from "path";

import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entitities/Post";
import { User } from "./entitities/User";

export default {
    migrations: { 
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post, User],
    port: 5050,
    dbName: 'levelup',
    user: 'postgres',
    password: 'pepe',
    debug: !__prod__,
    type: 'postgresql'
} as Parameters<typeof MikroORM.init>[0];