/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable("refresh_tokens");
  if (!exists) {
    await knex.schema.createTable("refresh_tokens", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      // gunakan VARCHAR agar dapat di-index
      table.string("token", 512).notNullable();
      table.timestamp("expires_at").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.index(["user_id"]);
      table.index(["token"]);
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("refresh_tokens");
}
