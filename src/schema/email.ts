import Joi from 'joi';

const from = Joi.string().email({ minDomainSegments: 2, tlds: false }).required().messages({
  'string.base': `"from" should be a type of 'text'`,
  'string.empty': `"from" cannot be an empty field`,
  'any.required': `"from" is a required field`,
});

const to = Joi.string().email({ minDomainSegments: 2, tlds: false }).required().messages({
  'string.base': `"to" should be a type of 'text'`,
  'string.empty': `"to" cannot be an empty field`,
  'any.required': `"to" is a required field`,
});

const subject = Joi.string().min(3).max(100).required().messages({
  'string.max': `"subject" should have a maximum length of 100`,
  'string.min': `"subject" should have a minimum length of 2`,
  'string.base': `"subject" should be a type of 'text'`,
  'string.empty': `"subject" cannot be an empty field`,
  'any.required': `"subject" is a required field`,
});

const body = Joi.string().min(1).required().messages({
  'string.max': `"body" should have a maximum length of 100`,
  'string.min': `"body" should have a minimum length of 2`,
  'string.base': `"body" should be a type of 'text'`,
  'string.empty': `"body" cannot be an empty field`,
  'any.required': `"body" is a required field`,
});

export const EmailSchema = Joi.object({
  subject,
  body,
  from,
  to,
});
