/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const has = await knex.schema.hasColumn("users", "role");
  if (!has) {
    await knex.schema.alterTable("users", (table) => {
      // gunakan VARCHAR agar kompatibel dengan MySQL dan mudah diubah nanti
      table.string("role", 50).notNullable().defaultTo("admin");
    });
  }
}

export async function down(knex) {
  const has = await knex.schema.hasColumn("users", "role");
  if (has) {
    await knex.schema.alterTable("users", (table) => {
      table.dropColumn("role");
    });
  }
}
