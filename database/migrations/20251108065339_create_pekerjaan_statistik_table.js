/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("pekerjaan_statistik", (table) => {
        table.increments("id_pekerjaan").primary();
        table
            .integer("tahun_id")
            .unsigned()
            .notNullable()
            .references("id_tahun")
            .inTable("tahun_data")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.integer("tidak_sekolah").notNullable().defaultTo(0);
        table.integer("petani").notNullable().defaultTo(0);
        table.integer("pelajar_mahasiswa").notNullable().defaultTo(0);
        table.integer("pegawai_swasta").notNullable().defaultTo(0);
        table.integer("wiraswasta").notNullable().defaultTo(0);
        table.integer("ibu_rumah_tangga").notNullable().defaultTo(0);
        table.integer("belum_bekerja").notNullable().defaultTo(0);
        table.integer("lainnya").notNullable().defaultTo(0);
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("pekerjaan_statistik");
};
