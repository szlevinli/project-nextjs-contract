import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Validation } from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join, omit } from 'ramda';
import { Company, CompanyUpdateFields } from '../../lib/sqlite/models';
import { validateCompany } from '../../lib/validations/companyValidation';
import { UpdateCompanyValidator } from '../../lib/validations/validator';

const updateCompany = (company: CompanyUpdateFields) =>
  TE.tryCatch(
    () => Company.update(omit(['id'], company), { where: { id: company.id } }),
    (reason) => new Error(String(reason))
  );

const updateCompanyHandler: NextApiHandler = async (req, res) => {
  const typeValidatedResult: Validation<CompanyUpdateFields> =
    UpdateCompanyValidator.decode(req.body);

  const task = pipe(
    typeValidatedResult,
    E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),
    E.chain((d) =>
      pipe(
        validateCompany(omit(['id'], d)),
        E.map((v) => ({ id: d.id, ...v }))
      )
    ),
    TE.fromEither,
    TE.chain((d) => updateCompany(d))
  );

  const result = await task();

  pipe(
    result,
    E.fold(
      (e) => res.status(290).json(String(e)),
      (d) => res.status(200).json(d[0])
    )
  );
};

export default withApiAuthRequired(updateCompanyHandler);
