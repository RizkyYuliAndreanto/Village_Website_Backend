/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("pendidikan_statistik", (table) => {
        table.increments("id_pendidikan").primary();
        table
            .integer("tahun_id")
            .unsigned()
            .notNullable()
            .references("id_tahun")
            .inTable("tahun_data")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.integer("tidak_sekolah").notNullable().defaultTo(0);
        table.integer("sd").notNullable().defaultTo(0);
        table.integer("smp").notNullable().defaultTo(0);
        table.integer("sma").notNullable().defaultTo(0);
        table.integer("d1_d4").notNullable().defaultTo(0);
        table.integer("s1").notNullable().defaultTo(0);
        table.integer("s2").notNullable().defaultTo(0);
        table.integer("s3").notNullable().defaultTo(0);
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("pendidikan_statistik");
};
