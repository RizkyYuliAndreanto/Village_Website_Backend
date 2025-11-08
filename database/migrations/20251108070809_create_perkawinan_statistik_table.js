/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("perkawinan_statistik", (table) => {
        table.increments("id_perkawinan").primary();
        table
            .integer("tahun_id")
            .unsigned()
            .notNullable()
            .references("id_tahun")
            .inTable("tahun_data")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.integer("kawin").notNullable().defaultTo(0);
        table.integer("cerai_hidup").notNullable().defaultTo(0);
        table.integer("cerai_mati").notNullable().defaultTo(0);
        table.integer("kawin_tercatat").notNullable().defaultTo(0);
        table.integer("kawin_tidak_tercatat").notNullable().defaultTo(0);
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("perkawinan_statistik");
};
