/**
 * @param { import("knex").Knex } knex
 */
export async function seed(knex) {
    // 1. Hapus data lama (child table dulu)
    await knex("demografi_penduduk").del();
    await knex("tahun_data").del();
  
    // 2. Masukkan data tahun (parent table)
    // Kita akan membuat data untuk 3 tahun: 2023, 2024, 2025
    await knex("tahun_data").insert([
      {
        tahun: 2023,
        keterangan: "Data Infografis Tahun 2023",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        tahun: 2024,
        keterangan: "Data Infografis Tahun 2024",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        tahun: 2025,
        keterangan: "Data Infografis Tahun 2025",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  
    // 3. Ambil ID dari tahun yang baru saja kita masukkan
    const tahun2023 = await knex("tahun_data").where("tahun", 2023).first();
    const tahun2024 = await knex("tahun_data").where("tahun", 2024).first();
    const tahun2025 = await knex("tahun_data").where("tahun", 2025).first();
  
    // 4. Masukkan data demografi (child table) menggunakan ID tahun di atas
    // Pastikan nama kolom "laki-laki" menggunakan tanda kutip
    // Perhatikan juga kolom "create_at" (bukan "created_at") sesuai migrasi Anda
    await knex("demografi_penduduk").insert([
      {
        tahun_id: tahun2023.id_tahun,
        total_penduduk: 1200,
        "laki_laki": 650,
        perempuan: 550,
        penduduk_sementara: 20,
        mutasi_penduduk: 5,
        create_at: new Date(),
        updated_at: new Date(),
      },
      {
        tahun_id: tahun2024.id_tahun,
        total_penduduk: 1250,
        "laki_laki": 670,
        perempuan: 580,
        penduduk_sementara: 25,
        mutasi_penduduk: 10,
        create_at: new Date(),
        updated_at: new Date(),
      },
      {
        tahun_id: tahun2025.id_tahun,
        total_penduduk: 1300,
        "laki_laki": 700,
        perempuan: 600,
        penduduk_sementara: 30,
        mutasi_penduduk: 12,
        create_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  }