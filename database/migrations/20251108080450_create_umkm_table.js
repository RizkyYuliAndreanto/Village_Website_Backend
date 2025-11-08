/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("umkm", (table) => {
    table.increments("umkm").primary();
    table.string("nama_usaha").notNullable();
    table.string("kategori").notNullable();
    table.string("deskripsi").notNullable();
    table.text("gambar_url").notNullable();
    table.string("tokopedia_url");
    table.string("shopee_url");
    table.string("facebook_url");
    table.string("instagram_url");
    table.string("tiktok_url");
    table.string("lazada_url");
    table.timestamp("create_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("umkm");
};
