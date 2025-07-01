import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import entities from "./entities/index";

const development = new DataSource({
    type: "sqlite",
    database: "database.sql",
    namingStrategy: new SnakeNamingStrategy(),
    logger: "debug",
    entities,
    migrations: ["./dist/migrations/*{.js,.ts}"],
});

const test = new DataSource({
    type: "sqlite",
    database: ":memory:",
    namingStrategy: new SnakeNamingStrategy(),
    logger: "debug",
    entities,
    migrations: ["./dist/migrations/*{.js,.ts}"],
});

interface IDataSource {
  [key: string]: DataSource;
}

const dbConfigs: IDataSource = {
  development,
  test,
}

export default dbConfigs
