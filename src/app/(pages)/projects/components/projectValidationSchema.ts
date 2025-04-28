import { object, string } from 'yup';

export const projectValidationSchema = object({
  name: string().required('Required field').max(100, 'Max length is 100'),
  region: string().required('Required field'),
  description: string().required('Required field').max(350, 'Max length is 350'),
});
