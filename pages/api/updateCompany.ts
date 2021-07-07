import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join } from 'ramda';
import { UpdateOptions } from 'sequelize';
import { Company, CompanyUpdateFields } from '../../lib/sqlite/models';
import { validateCompanyForUpdate } from '../../lib/validations/companyValidation';
import { UpdateCompanyValidator } from '../../lib/validations/validator';

const updateCompany =
  (company: CompanyUpdateFields) => (updateOptions: UpdateOptions) =>
    TE.tryCatch(
      () => Company.update(company, updateOptions),
      (reason) => new Error(String(reason))
    );

const updateCompanyHandler: NextApiHandler = async (req, res) => {
  // req.body: {values: CompanyUpdateFields, options: UpdateOptions}
  await pipe(
    // validate type
    UpdateCompanyValidator.decode(req.body),
    E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),
    // validate value
    // 只需要对 values 进行值验证. options 无需进行进行值验证.
    E.chainFirst((v) => validateCompanyForUpdate(v.values)),
    TE.fromEither,
    TE.chain((v) => updateCompany(v.values)(v.options)),
    TE.fold(
      (e) => async () => res.status(290).json(String(e)),
      (v) => async () => res.status(200).json(v[0])
    )
  )();
};

export default withApiAuthRequired(updateCompanyHandler);
