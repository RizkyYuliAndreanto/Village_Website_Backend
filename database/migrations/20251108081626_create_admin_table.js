/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("admin", (table) => {
        table.increments("id_admin").primary();
        table.string("nama_lengkap").notNullable();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.integer("no_handphone");
        table
            .enum("role", ["admin", "operator"])
            .notNullable()
            .defaultTo("operator");
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("admin");
};
