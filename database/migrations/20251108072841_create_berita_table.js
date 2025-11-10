/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("berita", (table) => {
        table.increments("id").primary();
        table.string("judul").notNullable();
        table.text("isi").notNullable();
        table.string("gambar_url").notNullable();
        table
            .enum("kegiatan", ["umum", "pengumuman", "kegiatan"])
            .notNullable()
            .defaultTo("umum");
        table.string("penulis").notNullable();
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("berita");
};
