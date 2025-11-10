/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("kategori_umkm", (table) => {
    table.increments("id").primary();
    table.string("nama", 150).notNullable().unique();
    table
      .string("slug", 150)
      .notNullable()
      .unique()
      .comment("friendly URL identifier");
    table.text("deskripsi").nullable();
    table
      .integer("parent_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("kategori_umkm")
      .onDelete("SET NULL")
      .onUpdate("CASCADE")
      .comment("opsional: sub-kategori");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["slug"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("kategori_umkm");
}
