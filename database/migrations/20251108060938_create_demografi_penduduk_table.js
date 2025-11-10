/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("demografi_penduduk", (table) => {
    table.increments("id_demografi").primary();
    table
      .integer("tahun_id")
      .unsigned()
      .notNullable()
      .references("id_tahun")
      .inTable("tahun_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("total_penduduk").notNullable().defaultTo(0);
    table.integer("laki-laki").notNullable().defaultTo(0);
    table.integer("perempuan").notNullable().defaultTo(0);
    table.integer("penduduk_sementara").notNullable().defaultTo(0);
    table.integer("mutasi_penduduk").notNullable().defaultTo(0);
    table.timestamp("create_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("demografi_penduduk");
}
