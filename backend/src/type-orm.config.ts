import { DataSource } from "typeorm";
import { Post } from "./entitities/Post";
import { User } from "./entitities/User";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5050,
    database: "learn",
    username: "postgres",
    password: "pepe",
    logging: true,
    synchronize: true,
    entities: [User, Post]
});

export default AppDataSource;