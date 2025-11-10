/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("agama_statistik", (table) => {
        table.increments("id_agama").primary();
        table
            .integer("tahun_id")
            .unsigned()
            .notNullable()
            .references("id_tahun")
            .inTable("tahun_data")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table.integer("islam").notNullable().defaultTo(0);
        table.integer("katolik").notNullable().defaultTo(0);
        table.integer("kristen").notNullable().defaultTo(0);
        table.integer("hindu").notNullable().defaultTo(0);
        table.integer("buddha").notNullable().defaultTo(0);
        table.integer("konghucu").notNullable().defaultTo(0);
        table.integer("kepercayaan_lain").notNullable().defaultTo(0);
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("agama_statistik");
};
