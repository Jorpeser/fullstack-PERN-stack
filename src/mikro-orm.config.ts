import { __prod__ } from "./constants";
import path from "path";

import { MikroORM } from "@mikro-orm/core";
import { Thread } from "./entitities/Thread";
import { Post } from "./entitities/Post";
import { User } from "./entitities/User";

export default {
    migrations: { 
        path: path.join(__dirname, "./migrations"),
        // __dirname es el directorio donde está este archivo
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post, User, Thread],
    port: 5050,
    dbName: 'levelup',
    user: 'postgres',
    password: 'pepe',
    debug: !__prod__,

    type: 'postgresql'
} as Parameters<typeof MikroORM.init>[0];

// Parameters<> devuelve un array con los parámetros de la función init (esto es TS avanzado)
// También podríamos haber hecho "export default {} as const;"
// Al hacerlo con Parameters<> tendremos la opción de autocompletar (Ctrl+Space) y poder ver los posibles parámetros de la función init.