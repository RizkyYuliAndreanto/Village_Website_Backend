/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // jika ada duplikat NIK, set NIK duplikat ke NULL (kecuali record dengan id terkecil)
  await knex.raw(`
    UPDATE masyarakats m
    JOIN (
      SELECT nik, MIN(id) AS keep_id
      FROM masyarakats
      WHERE nik IS NOT NULL AND nik <> ''
      GROUP BY nik
      HAVING COUNT(*) > 1
    ) k ON m.nik = k.nik
    SET m.nik = NULL
    WHERE m.id <> k.keep_id;
  `);

  const has = await knex.schema.hasColumn("masyarakats", "nik");
  if (has) {
    await knex.schema.alterTable("masyarakats", (table) => {
      table.string("nik", 30).nullable().alter();
      table.unique("nik", "masyarakats_nik_unique");
    });
  }
}

export async function down(knex) {
  const has = await knex.schema.hasColumn("masyarakats", "nik");
  if (has) {
    await knex.schema.alterTable("masyarakats", (table) => {
      table.dropUnique(["nik"], "masyarakats_nik_unique");
    });
  }
}
