import Joi from "joi";

export const createMasyarakatSchema = Joi.object({
  rt_id: Joi.number().integer().allow(null).optional(),
  dusun_id: Joi.number().integer().allow(null).optional(),
  nik: Joi.string().max(30).allow(null, "").optional(),
  no_kk: Joi.string().max(30).allow(null, "").optional(),
  nama_lengkap: Joi.string().max(255).required(),
  jenis_kelamin: Joi.string().max(20).allow(null, "").optional(),
  tanggal_lahir: Joi.date().iso().allow(null).optional(),
  alamat: Joi.string().max(500).allow(null, "").optional(),
  pendidikan_terakhir: Joi.string().max(100).allow(null, "").optional(),
  pekerjaan: Joi.string().max(150).allow(null, "").optional(),
  no_hp: Joi.string().max(50).allow(null, "").optional(),
  agama: Joi.string().max(50).allow(null, "").optional(),
  status_perkawinan: Joi.string().max(50).allow(null, "").optional(),
  hubungan_keluarga: Joi.string().max(50).allow(null, "").optional(),
  catatan: Joi.string().allow(null, "").optional(),
});

export const updateMasyarakatSchema = Joi.object({
  rt_id: Joi.number().integer().allow(null).optional(),
  dusun_id: Joi.number().integer().allow(null).optional(),
  nik: Joi.string().max(30).allow(null, "").optional(),
  no_kk: Joi.string().max(30).allow(null, "").optional(),
  nama_lengkap: Joi.string().max(255).optional(),
  jenis_kelamin: Joi.string().max(20).allow(null, "").optional(),
  tanggal_lahir: Joi.date().iso().allow(null).optional(),
  alamat: Joi.string().max(500).allow(null, "").optional(),
  pendidikan_terakhir: Joi.string().max(100).allow(null, "").optional(),
  pekerjaan: Joi.string().max(150).allow(null, "").optional(),
  no_hp: Joi.string().max(50).allow(null, "").optional(),
  agama: Joi.string().max(50).allow(null, "").optional(),
  status_perkawinan: Joi.string().max(50).allow(null, "").optional(),
  hubungan_keluarga: Joi.string().max(50).allow(null, "").optional(),
  catatan: Joi.string().allow(null, "").optional(),
});
