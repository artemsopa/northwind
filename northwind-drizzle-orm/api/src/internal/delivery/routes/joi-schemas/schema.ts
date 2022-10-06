import Joi from 'joi';
import ApiError from '../../../../pkg/error/api.error';

const validateSchema = (schema: Joi.Schema, context: any) => {
  const { error, value } = schema.validate(context, { abortEarly: false });
  if (error) throw ApiError.badRequest(error.details[0].message);
  return value;
};

export default validateSchema;
