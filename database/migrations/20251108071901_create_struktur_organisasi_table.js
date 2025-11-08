/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("struktur_organisasi", (table) => {
        table.increments("id_struktur").primary();
        table.string("nama").notNullable();
        table.string("jabatan").notNullable();
        table.string("foto_url").notNullable();
        table.text("keterangan");
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists(struktur_organisasi)
};
