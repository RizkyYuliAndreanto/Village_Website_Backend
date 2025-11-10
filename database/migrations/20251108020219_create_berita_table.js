/**
 * Migration: create beritas (news) — safe: only create if not exists
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const exists = await knex.schema.hasTable("beritas");
  if (exists) {
    // table already exists — nothing to do
    return;
  }

  await knex.schema.createTable("beritas", (table) => {
    table.increments("id").primary();

    // relasi ke kategori (parent logical)
    table
      .integer("kategori_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("kategori_berita")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table.string("judul", 300).notNullable();
    table.string("slug", 300).notNullable().unique();
    table.text("konten").notNullable();
    table.text("excerpt").nullable().comment("ringkasan pendek untuk listing");
    table.string("thumbnail_url", 500).nullable();

    table
      .enu("status", ["draft", "published", "archived"], {
        useNative: true,
        enumName: "berita_status",
      })
      .defaultTo("draft");
    table.timestamp("published_at").nullable();

    table.string("meta_title", 255).nullable();
    table.text("meta_description").nullable();
    table.integer("views").unsigned().defaultTo(0);

    table.boolean("is_deleted").defaultTo(false);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["kategori_id"]);
    table.index(["slug"]);
    table.index(["status"]);
    
  });
}

export async function down(knex) {
  const exists = await knex.schema.hasTable("beritas");
  if (exists) {
    await knex.schema.dropTableIfExists("beritas");
  }
}
