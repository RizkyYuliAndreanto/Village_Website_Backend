/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("ppid_dokumen", (table) => {
        table.increments("id").primary();
        table.string("judul_dokumen").notNullable();
        table.string("file_url").notNullable();
        table
            .enum("kategori", ["informasi berkala", "informasi sertamerta",
                "informasi setiap saat", "informasi dikecualikan"])
            .notNullable()
            .defaultTo("informasi berkala");
        table.integer("tahun").notNullable();
        table.date("tanggal_upload").notNullable();
        table.string("uploader").notNullable();
        table.timestamp("create_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists("ppid_dokumen");
};
