import Joi from "joi";

export const createRtSchema = Joi.object({
  dusun_id: Joi.number().integer().required(),
  nama: Joi.string().max(100).required(),
  kode: Joi.string().max(50).allow(null, "").optional(),
  keterangan: Joi.string().allow(null, "").optional(),
});

export const updateRtSchema = Joi.object({
  dusun_id: Joi.number().integer().optional(),
  nama: Joi.string().max(100).optional(),
  kode: Joi.string().max(50).allow(null, "").optional(),
  keterangan: Joi.string().allow(null, "").optional(),
});
