/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // pastikan rts (dan dusuns) sudah dibuat sebelumnya
  await knex.schema.createTable("masyarakats", (table) => {
    table.increments("id").primary();

    // relasi ke RT (jika RT dihapus, kita set null agar data warga tetap ada)
    table
      .integer("rt_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("rts")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    // redundan: simpan juga dusun_id supaya query lebih cepat (opsional)
    table
      .integer("dusun_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("dusuns")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table.string("nik", 30).nullable().comment("Nomor Induk Kependudukan");
    table.string("no_kk", 30).nullable().comment("Nomor Kartu Keluarga");
    table.string("nama_lengkap", 255).notNullable();
    table.string("jenis_kelamin", 20).nullable();
    table.date("tanggal_lahir").nullable();
    table.string("alamat", 500).nullable();
    table.string("pendidikan_terakhir", 100).nullable();
    table.string("pekerjaan", 150).nullable();
    table.string("no_hp", 50).nullable();
    table.string("agama", 50).nullable();
    table.string("status_perkawinan", 50).nullable();
    table
      .string("hubungan_keluarga", 50)
      .nullable()
      .comment("Kepala keluarga / Istri / Anak / dst");
    table.text("catatan").nullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["rt_id"]);
    table.index(["dusun_id"]);
    table.index(["nama_lengkap"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("masyarakats");
}
