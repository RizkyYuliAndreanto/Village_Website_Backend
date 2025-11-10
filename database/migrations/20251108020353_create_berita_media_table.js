/**
 * Migration: create berita_media
 * Menyimpan gambar / file yang berkaitan dengan satu berita (galeri)
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("berita_media", (table) => {
    table.increments("id").primary();
    table
      .integer("berita_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("beritas")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("url", 1000).notNullable();
    table
      .string("tipe", 100)
      .nullable()
      .comment("image/jpeg, image/png, application/pdf, dll");
    table.string("keterangan", 500).nullable();
    table
      .integer("urutan")
      .unsigned()
      .defaultTo(0)
      .comment("urut tampil di galeri");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["berita_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("berita_media");
}
