import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { sequenceT } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getSemigroup } from 'fp-ts/NonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { Validation } from 'io-ts';
import reporter from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join, zipObj } from 'ramda';
import { Company, CompanyCreationFields } from '../../lib/sqlite/models';
import { maxLength, minLength } from '../../lib/utils/validations';
import { AddCompanyValidator } from '../../lib/utils/validator';

const minLenFourOfName = minLength(4);
const maxLenThirtyOfName = maxLength(30);
const minLenTwoOfAbbr = minLength(2);
const maxLenSixOfName = maxLength(6);

const sequenceValidate = sequenceT(
  E.getApplicativeValidation(getSemigroup<string>())
);

const validateName = (name: string) =>
  pipe(
    sequenceValidate(minLenFourOfName(name), maxLenThirtyOfName(name)),
    E.map(() => name)
  );

const validateAbbr = (abbr: string) =>
  pipe(
    sequenceValidate(minLenTwoOfAbbr(abbr), maxLenSixOfName(abbr)),
    E.map(() => abbr)
  );

const validateCompany = (
  company: CompanyCreationFields
): E.Either<Error, CompanyCreationFields> =>
  pipe(
    // Either<NonEmptyArray<string>, string[]>
    sequenceValidate(validateName(company.name), validateAbbr(company.abbr)),
    // Either<Error, string[]>
    E.mapLeft((e) => new Error(e.join('\n'))),
    // Either<Error, CompanyCreationFields>
    E.map(zipObj<keyof CompanyCreationFields>(['name', 'abbr']))
  );

const createCompany = (company: CompanyCreationFields) =>
  TE.tryCatch(
    () => Company.create(company),
    (reason) => new Error(String(reason))
  );

const handler: NextApiHandler = async (req, res) => {
  // 验证请求新增的 company 是否满足静态类型 `CompanyCreationFields` 要求
  // 这里使用 `io-ts` 进行静态类型验证
  // Validation<CompanyCreationFields> 实际上等同于 Either<Errors, CompanyCreationFields>
  const validatedResult: Validation<CompanyCreationFields> =
    AddCompanyValidator.decode(req.body);

  // 以下代码通过 `fp-ts/TaskEither` 实现如下的目标:
  //   - 如果客户端传递过来的数据通过静态类型验证, 则调用创建 company api
  //   - 否则跳过调用创建 company api (这得益于 `fp-ts/TaskEither`)
  const task = pipe(
    // Either<Errors, CompanyCreationFields>
    validatedResult,

    // Either<Error, CompanyCreationFields>
    // 将 Errors 转换成 Error 便于后续 composition
    E.mapLeft((_) => pipe(validatedResult, reporter.report, join('\n'), Error)),

    // 验证传入的 company 的值
    E.chain(validateCompany),

    // Either -> TaskEither
    TE.fromEither,

    // compose
    TE.chain((company) => createCompany(company))
  );

  // 执行 TaskEither. 返回 Either
  const result = await task();

  // 结构上面的执行结果
  pipe(
    result,
    E.fold(
      (e) => res.status(290).json(String(e)),
      (d) => res.status(200).json(d.toJSON())
    )
  );
};

export default withApiAuthRequired(handler);
