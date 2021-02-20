import knex from "./knex";

export async function getPrefix() {
  const p = await knex("config").where({ key: "prefix" }).select();
  return p[0].value;
}
