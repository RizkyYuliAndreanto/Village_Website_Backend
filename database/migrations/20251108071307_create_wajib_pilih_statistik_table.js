/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("wajib_pilih_statistik", (table) => {
    table.increments("id_wajib_pilih").primary();
    table
            .integer("tahun_id")
            .unsigned()
            .notNullable()
            .references("id_tahun")
            .inTable("tahun_data")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    table.integer("laki_laki").notNullable().defaultTo(0);
    table.integer("perempuan").notNullable().defaultTo(0);
    table.integer("total").notNullable().defaultTo(0);
    table.timestamp("create_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("wajib_piih_statistik")
};
