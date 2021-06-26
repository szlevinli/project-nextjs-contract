import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Company } from '../../lib/sqlite/models';
import { deleteRecord } from '../../lib/utils/deleteRecord';
import { DeleteCompanyValidator } from '../../lib/validations/validator';

const deleteCompanyHandler = deleteRecord(Company)(DeleteCompanyValidator);

export default withApiAuthRequired(deleteCompanyHandler);
