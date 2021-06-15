import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiHandler } from 'next';
import { join } from 'ramda';
import { Company, CompanyCreateFields } from '../../lib/sqlite/models';
import { validateCompany } from '../../lib/validations/companyValidation';
import { CreateCompanyValidator } from '../../lib/validations/validator';

const createCompany = (company: CompanyCreateFields) =>
  TE.tryCatch(
    () => Company.create(company),
    (reason) => new Error(String(reason))
  );

const createCompanyHandler: NextApiHandler = async (req, res) => {
  // 以下代码通过 `fp-ts/TaskEither` 实现如下的目标:
  //   - 对客户端数据进行类型验证
  //   - 对客户端数据进行数值验证
  //   - 创建记录
  //   - 将执行结果返回给客户端
  //     - 上面的步骤发生错误则使用状态码 290 加错误信息返回
  //     - 否则(无异常情况)使用状态码 200 返回执行结果
  await pipe(
    // 验证请求新增的 company 是否满足静态类型 `CompanyCreationFields` 要求
    // 这里使用 `io-ts` 进行静态类型验证
    // Validation<CompanyCreationFields> 实际上等同于 Either<Errors, CompanyCreationFields>
    // Either<Errors, CompanyCreationFields>
    CreateCompanyValidator.decode(req.body),

    // Either<Error, CompanyCreationFields>
    // 将 Errors 转换成 Error 便于后续 composition
    E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),

    // 验证传入的 company 的值
    E.chain(validateCompany),

    // Either -> TaskEither
    TE.fromEither,

    // compose
    TE.chain((company) => createCompany(company)),

    // destructor
    TE.fold(
      (e) => async () => res.status(290).json(String(e)),
      (d) => async () => res.status(200).json(d.toJSON())
    )
  )();
};

export default withApiAuthRequired(createCompanyHandler);
