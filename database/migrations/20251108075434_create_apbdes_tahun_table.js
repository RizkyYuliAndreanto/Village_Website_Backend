/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("apbdes_tahun", (table) => {
    table.increments("id").primary();
    table.integer("tahun").notNullable();
    table.decimal("total_pendapatan").notNullable();
    table.decimal("total_pengeluaran").notNullable();
    table.decimal("saldo_akhir").notNullable();
    table
    .enum("status", ["surplus","defisit","seimbang"])
    .notNullable()
    .defaultTo("surplus");
    table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists(apbdes_tahun);
};
