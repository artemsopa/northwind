import Joi from 'joi';
import { ErrorApi } from '../../../../pkg/error';

const validateSchema = (schema: Joi.Schema, context: any) => {
  const { error, value } = schema.validate(context, { abortEarly: false });
  if (error) throw ErrorApi.badRequest(error.details[0].message);
  return value;
};

export default validateSchema;
