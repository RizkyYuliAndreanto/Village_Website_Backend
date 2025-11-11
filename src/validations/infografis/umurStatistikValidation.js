import Joi from "joi";

export const createUmurStatistikValidation = Joi.object({
  tahun_id: Joi.number().integer().positive().required().messages({
    "number.base": "Tahun ID harus berupa angka",
    "number.integer": "Tahun ID harus berupa bilangan bulat",
    "number.positive": "Tahun ID harus berupa angka positif",
    "any.required": "Tahun ID wajib diisi"
  }),
  umur_0_4: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 0-4 harus berupa angka",
    "number.integer": "Jumlah umur 0-4 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 0-4 tidak boleh kurang dari 0"
  }),
  umur_5_9: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 5-9 harus berupa angka",
    "number.integer": "Jumlah umur 5-9 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 5-9 tidak boleh kurang dari 0"
  }),
  umur_10_14: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 10-14 harus berupa angka",
    "number.integer": "Jumlah umur 10-14 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 10-14 tidak boleh kurang dari 0"
  }),
  umur_15_19: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 15-19 harus berupa angka",
    "number.integer": "Jumlah umur 15-19 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 15-19 tidak boleh kurang dari 0"
  }),
  umur_20_24: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 20-24 harus berupa angka",
    "number.integer": "Jumlah umur 20-24 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 20-24 tidak boleh kurang dari 0"
  }),
  umur_25_29: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 25-29 harus berupa angka",
    "number.integer": "Jumlah umur 25-29 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 25-29 tidak boleh kurang dari 0"
  }),
  umur_30_34: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 30-34 harus berupa angka",
    "number.integer": "Jumlah umur 30-34 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 30-34 tidak boleh kurang dari 0"
  }),
  umur_35_39: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 35-39 harus berupa angka",
    "number.integer": "Jumlah umur 35-39 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 35-39 tidak boleh kurang dari 0"
  }),
  umur_40_44: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 40-44 harus berupa angka",
    "number.integer": "Jumlah umur 40-44 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 40-44 tidak boleh kurang dari 0"
  }),
  umur_45_49: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 45-49 harus berupa angka",
    "number.integer": "Jumlah umur 45-49 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 45-49 tidak boleh kurang dari 0"
  }),
  umur_50_plus: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Jumlah umur 50+ harus berupa angka",
    "number.integer": "Jumlah umur 50+ harus berupa bilangan bulat",
    "number.min": "Jumlah umur 50+ tidak boleh kurang dari 0"
  })
});

export const updateUmurStatistikValidation = Joi.object({
  tahun_id: Joi.number().integer().positive().messages({
    "number.base": "Tahun ID harus berupa angka",
    "number.integer": "Tahun ID harus berupa bilangan bulat",
    "number.positive": "Tahun ID harus berupa angka positif"
  }),
  umur_0_4: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 0-4 harus berupa angka",
    "number.integer": "Jumlah umur 0-4 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 0-4 tidak boleh kurang dari 0"
  }),
  umur_5_9: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 5-9 harus berupa angka",
    "number.integer": "Jumlah umur 5-9 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 5-9 tidak boleh kurang dari 0"
  }),
  umur_10_14: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 10-14 harus berupa angka",
    "number.integer": "Jumlah umur 10-14 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 10-14 tidak boleh kurang dari 0"
  }),
  umur_15_19: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 15-19 harus berupa angka",
    "number.integer": "Jumlah umur 15-19 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 15-19 tidak boleh kurang dari 0"
  }),
  umur_20_24: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 20-24 harus berupa angka",
    "number.integer": "Jumlah umur 20-24 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 20-24 tidak boleh kurang dari 0"
  }),
  umur_25_29: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 25-29 harus berupa angka",
    "number.integer": "Jumlah umur 25-29 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 25-29 tidak boleh kurang dari 0"
  }),
  umur_30_34: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 30-34 harus berupa angka",
    "number.integer": "Jumlah umur 30-34 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 30-34 tidak boleh kurang dari 0"
  }),
  umur_35_39: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 35-39 harus berupa angka",
    "number.integer": "Jumlah umur 35-39 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 35-39 tidak boleh kurang dari 0"
  }),
  umur_40_44: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 40-44 harus berupa angka",
    "number.integer": "Jumlah umur 40-44 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 40-44 tidak boleh kurang dari 0"
  }),
  umur_45_49: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 45-49 harus berupa angka",
    "number.integer": "Jumlah umur 45-49 harus berupa bilangan bulat",
    "number.min": "Jumlah umur 45-49 tidak boleh kurang dari 0"
  }),
  umur_50_plus: Joi.number().integer().min(0).messages({
    "number.base": "Jumlah umur 50+ harus berupa angka",
    "number.integer": "Jumlah umur 50+ harus berupa bilangan bulat",
    "number.min": "Jumlah umur 50+ tidak boleh kurang dari 0"
  })
}).min(1).messages({
  "object.min": "Setidaknya satu field harus diisi untuk update"
});

export const paramIdValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID harus berupa angka",
    "number.integer": "ID harus berupa bilangan bulat",
    "number.positive": "ID harus berupa angka positif",
    "any.required": "ID wajib diisi"
  })
});

export const paramTahunValidation = Joi.object({
  tahun: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun harus berupa angka",
    "number.integer": "Tahun harus berupa bilangan bulat",
    "number.min": "Tahun tidak boleh kurang dari 1900",
    "number.max": "Tahun tidak boleh lebih dari 2100",
    "any.required": "Tahun wajib diisi"
  })
});

export const paramCompareTahunValidation = Joi.object({
  tahun1: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun 1 harus berupa angka",
    "number.integer": "Tahun 1 harus berupa bilangan bulat",
    "number.min": "Tahun 1 tidak boleh kurang dari 1900",
    "number.max": "Tahun 1 tidak boleh lebih dari 2100",
    "any.required": "Tahun 1 wajib diisi"
  }),
  tahun2: Joi.number().integer().min(1900).max(2100).required().messages({
    "number.base": "Tahun 2 harus berupa angka",
    "number.integer": "Tahun 2 harus berupa bilangan bulat",
    "number.min": "Tahun 2 tidak boleh kurang dari 1900",
    "number.max": "Tahun 2 tidak boleh lebih dari 2100",
    "any.required": "Tahun 2 wajib diisi"
  })
});