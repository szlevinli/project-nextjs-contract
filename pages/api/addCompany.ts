import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Company } from '../../lib/sqlite/models';
import { createRecord } from '../../lib/utils/createRecord';
import { validateCompany } from '../../lib/validations/companyValidation';
import { CreateCompanyValidator } from '../../lib/validations/validator';

const createCompanyHandler = createRecord(Company)(CreateCompanyValidator)(
  validateCompany
);

export default withApiAuthRequired(createCompanyHandler);
