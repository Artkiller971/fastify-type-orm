import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export default new DataSource({
    type: "sqlite",
    database: "database.sql",
    namingStrategy: new SnakeNamingStrategy(),
    logger: "debug",
    entities: ["./dist/entities/*{.js,.ts}"],
    migrations: ["./dist/migrations/*{.js,.ts}"],
});
