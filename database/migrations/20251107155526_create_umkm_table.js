/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("umkms", (table) => {
    table.increments("id").primary();

    // relasi ke kategori
    table
      .integer("kategori_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("kategori_umkm")
      .onDelete("RESTRICT") // ganti ke CASCADE / SET NULL sesuai kebijakan
      .onUpdate("CASCADE");

    table.string("nama", 255).notNullable();
    table.string("slug", 255).notNullable().unique();
    table.text("deskripsi").nullable();

    // informasi lokasi & kontak
    table.string("pemilik", 150).nullable();
    table.string("alamat", 500).nullable();
    table.string("dusun", 150).nullable();
    table.string("rt", 50).nullable();
    table.string("rw", 50).nullable();
    table.string("kecamatan", 150).nullable();
    table.string("kota", 150).nullable();
    table.string("provinsi", 150).nullable();
    table.string("kode_pos", 20).nullable();

    table.string("telepon", 50).nullable();
    table.string("whatsapp", 50).nullable();
    table.string("email", 255).nullable();
    table.string("website", 255).nullable();
    table.string("sosial_facebook", 255).nullable();
    table.string("sosial_instagram", 255).nullable();
    table.string("sosial_tiktok", 255).nullable();

    // data usaha
    table.string("jenis_usaha", 150).nullable();
    table.string("status_usaha", 50).nullable().comment("aktif / non-aktif");
    table.decimal("omset_per_bulan", 14, 2).nullable();
    table
      .string("skala_usaha", 50)
      .nullable()
      .comment("mikro / kecil / menengah");
    table.integer("jumlah_karyawan").unsigned().nullable();

    // media / gambar
    table.string("logo_url", 500).nullable();
    table.text("foto_galeri").nullable().comment("json array url jika ingin");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // index yang umum dipakai
    table.index(["kategori_id"]);
    table.index(["nama"]);
    table.index(["slug"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("umkms");
}
