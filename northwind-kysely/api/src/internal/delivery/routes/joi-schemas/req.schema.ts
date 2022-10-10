import Joi from 'joi';

export const idReqSchema = Joi.object().keys({
  id: Joi.string().required(),
}).unknown(true);

export const productReqSchema = Joi.object().keys({
  name: Joi.string().required(),
}).unknown(true);

export const customerReqSchema = Joi.object().keys({
  company: Joi.string().required(),
}).unknown(true);
