/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("dusuns", (table) => {
    table.increments("id").primary();
    table.string("nama", 150).notNullable();
    table.string("kode", 50).nullable();
    table.text("keterangan").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("dusuns");
}
