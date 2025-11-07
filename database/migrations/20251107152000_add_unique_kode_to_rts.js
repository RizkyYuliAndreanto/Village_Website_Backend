/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // hapus duplikat kode (biarkan id terkecil)
  await knex.raw(`
    DELETE d FROM rts d
    JOIN (
      SELECT kode, MIN(id) AS keep_id
      FROM rts
      WHERE kode IS NOT NULL
      GROUP BY kode
      HAVING COUNT(*) > 1
    ) k ON d.kode = k.kode
    WHERE d.id <> k.keep_id;
  `);

  const has = await knex.schema.hasColumn("rts", "kode");
  if (has) {
    await knex.schema.alterTable("rts", (table) => {
      table.unique("kode", "rts_kode_unique");
    });
  }
}

export async function down(knex) {
  const has = await knex.schema.hasColumn("rts", "kode");
  if (has) {
    await knex.schema.alterTable("rts", (table) => {
      table.dropUnique(["kode"], "rts_kode_unique");
    });
  }
}
