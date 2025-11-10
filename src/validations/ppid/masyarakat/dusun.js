import Joi from "joi";

export const createDusunSchema = Joi.object({
  nama: Joi.string().max(150).required(),
  kode: Joi.string().max(50).allow(null, "").optional(),
  keterangan: Joi.string().allow(null, "").optional(),
});

export const updateDusunSchema = Joi.object({
  nama: Joi.string().max(150).optional(),
  kode: Joi.string().max(50).allow(null, "").optional(),
  keterangan: Joi.string().allow(null, "").optional(),
});
