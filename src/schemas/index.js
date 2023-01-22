const Joi = require("joi");

const addContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.number().integer().required(),
});

const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  phone: Joi.number().integer().required(),
  favorite: Joi.boolean(),
});

const validationSchemaStatus = Joi.object({
  favorite: Joi.boolean(),
});

const signupSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ua"] },
  }),
  password: Joi.string().required(),
});

module.exports = {
  addContactsSchema,
  updateContactsSchema,
  validationSchemaStatus,
  signupSchema,
  loginSchema,
};
