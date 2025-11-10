/**
 * @param { import("knex").Knex } knex
 */
export async function seed(knex) {
    // 1. Hapus data lama (child tables)
    await knex("umur_statistik").del();
    await knex("agama_statistik").del();
    await knex("pendidikan_statistik").del();
    await knex("pekerjaan_statistik").del();
    await knex("perkawinan_statistik").del();
    await knex("wajib_pilih_statistik").del();
  
    // 2. Ambil ID tahun dari seeder sebelumnya (001_infografis_seed.js)
    const tahun2023 = await knex("tahun_data").where("tahun", 2023).first();
    const tahun2024 = await knex("tahun_data").where("tahun", 2024).first();
    const tahun2025 = await knex("tahun_data").where("tahun", 2025).first();
  
    if (!tahun2023 || !tahun2024 || !tahun2025) {
      console.error(
        "Data tahun (2023, 2024, 2025) tidak ditemukan. Jalankan 001_infografis_seed.js terlebih dahulu."
      );
      return;
    }
    
    const now = new Date();
  
    // --- 3. Seeder Umur Statistik ---
    // Migrasi menggunakan 'created_at'
    await knex("umur_statistik").insert([
      {
        tahun_id: tahun2024.id_tahun,
        umur_0_4: 100,
        umur_5_9: 110,
        umur_10_14: 120,
        umur_15_19: 130,
        umur_20_24: 140,
        umur_25_29: 100,
        umur_30_34: 90,
        umur_35_39: 80,
        umur_40_44: 70,
        umur_45_49: 60,
        umur_50_plus: 150, // Total: 1150
        created_at: now,
        updated_at: now,
      },
      {
        tahun_id: tahun2025.id_tahun,
        umur_0_4: 105,
        umur_5_9: 115,
        umur_10_14: 125,
        umur_15_19: 135,
        umur_20_24: 145,
        umur_25_29: 105,
        umur_30_34: 95,
        umur_35_39: 85,
        umur_40_44: 75,
        umur_45_49: 65,
        umur_50_plus: 155, // Total: 1205
        created_at: now,
        updated_at: now,
      },
    ]);
  
    // --- 4. Seeder Agama Statistik ---
    // Migrasi menggunakan 'create_at'
    await knex("agama_statistik").insert([
      {
        tahun_id: tahun2024.id_tahun,
        islam: 1100,
        katolik: 10,
        kristen: 25,
        hindu: 3,
        buddha: 2,
        konghucu: 0,
        kepercayaan_lain: 10, // Total: 1150
        create_at: now,
        updated_at: now,
      },
      {
        tahun_id: tahun2025.id_tahun,
        islam: 1150,
        katolik: 12,
        kristen: 25,
        hindu: 3,
        buddha: 2,
        konghucu: 1,
        kepercayaan_lain: 12, // Total: 1205
        create_at: now,
        updated_at: now,
      },
    ]);
  
    // --- 5. Seeder Pendidikan Statistik ---
    // Migrasi menggunakan 'create_at'
    await knex("pendidikan_statistik").insert([
      {
        tahun_id: tahun2025.id_tahun,
        tidak_sekolah: 50,
        sd: 300,
        smp: 250,
        sma: 350,
        d1_d4: 100,
        s1: 200,
        s2: 45,
        s3: 5, // Total: 1300 (Cocok dengan demografi 2025)
        create_at: now,
        updated_at: now,
      },
    ]);
  
    // --- 6. Seeder Pekerjaan Statistik ---
    // Migrasi menggunakan 'create_at'
    await knex("pekerjaan_statistik").insert([
      {
        tahun_id: tahun2025.id_tahun,
        tidak_sekolah: 100, // (Contoh: Lansia/Balita)
        petani: 400,
        pelajar_mahasiswa: 250,
        pegawai_swasta: 200,
        wiraswasta: 150,
        ibu_rumah_tangga: 150,
        belum_bekerja: 50,
        lainnya: 0, // Total: 1300 (Cocok dengan demografi 2025)
        create_at: now,
        updated_at: now,
      },
    ]);
  
    // --- 7. Seeder Perkawinan Statistik ---
    // Migrasi menggunakan 'create_at'
    await knex("perkawinan_statistik").insert([
      {
        tahun_id: tahun2025.id_tahun,
        kawin: 700,
        cerai_hidup: 50,
        cerai_mati: 25,
        kawin_tercatat: 680,
        kawin_tidak_tercatat: 20,
        create_at: now,
        updated_at: now,
      },
    ]);
  
    // --- 8. Seeder Wajib Pilih Statistik ---
    // Migrasi menggunakan 'create_at' dan 'laki_laki' (underscore)
    await knex("wajib_pilih_statistik").insert([
      {
        tahun_id: tahun2025.id_tahun,
        laki_laki: 550, // Menggunakan underscore
        perempuan: 500,
        total: 1050,
        create_at: now,
        updated_at: now,
      },
    ]);
  }