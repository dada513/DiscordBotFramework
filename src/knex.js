import * as config from "../config.json";
import knexjs from "knex";

const knex = knexjs({
  client: "mysql2",
  connection: {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
  },
});

export default knex;

async function FixTables() {
  if (!(await knex.schema.hasTable("config"))) {
    await knex.schema.createTable("config", (t) => {
      t.increments("id");
      t.string("key");
      t.string("description");
      t.string("value");
    });

    await knex("config").insert({
      key: "prefix",
      description: "prefix of the bot",
      value: ";",
    });
  }
}

FixTables();
