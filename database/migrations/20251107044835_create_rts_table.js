/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // pastikan table dusuns sudah dibuat (urutkan migrations)
  await knex.schema.createTable("rts", (table) => {
    table.increments("id").primary();
    table
      .integer("dusun_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("dusuns")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("nama", 100).notNullable(); // mis. "RT 01"
    table.string("kode", 50).nullable();
    table.text("keterangan").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["dusun_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("rts");
}
