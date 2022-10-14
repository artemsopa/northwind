import { z } from 'zod';

export const idSchema = z.object({
  id: z.string({
    required_error: 'Parameter `id` is required!',
    invalid_type_error: 'Parameter `id` must be a string!',
  }),
});

export const productSchema = z.object({
  name: z.string({
    required_error: 'Parameter `name` is required!',
    invalid_type_error: 'Parameter `name` must be a string!',
  }),
});

export const customerSchema = z.object({
  company: z.string({
    required_error: 'Parameter `company` is required!',
    invalid_type_error: 'Parameter `company` must be a string!',
  }),
});
