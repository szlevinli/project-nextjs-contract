import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { fold, mapLeft as eitherMapLeft } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { chain, fromEither, tryCatch } from 'fp-ts/TaskEither';
import reporter from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join } from 'ramda';
import { Company, CompanyCreationFields } from '../../lib/sqlite/models';
import { AddCompanyValidator } from '../../lib/utils/validator';

const createCompany = (company: CompanyCreationFields) =>
  tryCatch(
    () => Company.create(company),
    (reason) => new Error(String(reason))
  );

const handler: NextApiHandler = async (req, res) => {
  const validatedResult = AddCompanyValidator.decode(req.body);
  const task = pipe(
    validatedResult,
    eitherMapLeft((_) =>
      pipe(validatedResult, reporter.report, join('\n'), Error)
    ),
    fromEither,
    chain((company) => createCompany(company))
  );

  const result = await task();

  pipe(
    result,
    fold(
      (e) => res.status(400).json(e),
      (d) => res.status(200).json(d)
    )
  );
};

export default withApiAuthRequired(handler);
