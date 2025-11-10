/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("umur_statistik", (table) => {
        table.increments("id_umur").primary();
        table
            .integer("tahun_id")
            .unsigned()
            .notNullable()
            .references("id_tahun")
            .inTable("tahun_data")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.integer("umur_0_4").notNullable().defaultTo(0);
        table.integer("umur_5_9").notNullable().defaultTo(0);
        table.integer("umur_10_14").notNullable().defaultTo(0);
        table.integer("umur_15_19").notNullable().defaultTo(0);
        table.integer("umur_20_24").notNullable().defaultTo(0);
        table.integer("umur_25_29").notNullable().defaultTo(0);
        table.integer("umur_30_34").notNullable().defaultTo(0);
        table.integer("umur_35_39").notNullable().defaultTo(0);
        table.integer("umur_40_44").notNullable().defaultTo(0);
        table.integer("umur_45_49").notNullable().defaultTo(0);
        table.integer("umur_50_plus").notNullable().defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropSchemaIfExists("umur_statistik");
};
