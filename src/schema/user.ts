import Joi from 'joi';

const username = Joi.string().email({ minDomainSegments: 2, tlds: false }).required().messages({
  'string.base': `"username" should be a type of 'text'`,
  'string.empty': `"username" cannot be an empty field`,
  'any.required': `"username" is a required field`,
});

const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
  'string.base': `"password" should be a type of 'text'`,
  'string.empty': `"password" cannot be an empty field`,
  'any.required': `"password" is a required field`,
});

const name = Joi.string().min(3).max(100).required().messages({
  'string.max': `"name" should have a maximum length of 100`,
  'string.min': `"name" should have a minimum length of 2`,
  'string.base': `"name" should be a type of 'text'`,
  'string.empty': `"name" cannot be an empty field`,
  'any.required': `"name" is a required field`,
});

export const UserSchema = Joi.object({
  username,
  password,
  name,
});

export const UserLoginSchema = Joi.object({
  username,
  password,
});
