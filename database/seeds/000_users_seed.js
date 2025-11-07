import bcrypt from "bcryptjs";

/**
 * Seed users table
 * @param { import("knex").Knex } knex
 */
export async function seed(knex) {
  // Hapus data lama (development)
  await knex("users").del();

  const passwordHash = await bcrypt.hash("password", 12);

  await knex("users").insert([
    {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Admin2",
      email: "admin2@example.com",
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
