/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("pendapatan", (table) => {
table.increments("id").primary();
table
.integer("tahun_id")
.unsigned()
.notNullable()
.references("id_tahun")
.inTable("tahun_data")
.onDelete("CASCADE")
.onUpdate("CASCADE");
table.string("kategori").notNullable();
table.string("nama_rincian").notNullable();
table.decimal("jumlah").notNullable();
table.text("keterangan");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("pendapatan");
};
