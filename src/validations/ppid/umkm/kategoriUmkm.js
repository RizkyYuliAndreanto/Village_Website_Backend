import Joi from "joi";

export const createKategoriUmkmSchema = Joi.object({
  nama: Joi.string().max(150).required(),
  slug: Joi.string().max(150).allow(null, "").optional(),
  deskripsi: Joi.string().allow(null, "").optional(),
  parent_id: Joi.number().integer().allow(null).optional(),
});

export const updateKategoriUmkmSchema = Joi.object({
  nama: Joi.string().max(150).optional(),
  slug: Joi.string().max(150).allow(null, "").optional(),
  deskripsi: Joi.string().allow(null, "").optional(),
  parent_id: Joi.number().integer().allow(null).optional(),
});
