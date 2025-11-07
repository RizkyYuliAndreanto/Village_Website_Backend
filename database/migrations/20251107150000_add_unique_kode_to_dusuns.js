/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const has = await knex.schema.hasColumn("dusuns", "kode");
  if (has) {
    await knex.schema.alterTable("dusuns", (table) => {
      // tambahkan unique index; jika sudah ada index dengan nama ini, migration akan error
      table.unique("kode", "dusuns_kode_unique");
    });
  }
}

export async function down(knex) {
  const has = await knex.schema.hasColumn("dusuns", "kode");
  if (has) {
    await knex.schema.alterTable("dusuns", (table) => {
      table.dropUnique(["kode"], "dusuns_kode_unique");
    });
  }
}
