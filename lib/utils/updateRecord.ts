import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Props, TypeC, TypeOf } from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'ramda';
import { Model, ModelCtor } from 'sequelize';

export const updateRecord =
  <AllFields, CreateFields, P extends Props, K extends keyof P>(
    Model: ModelCtor<Model<AllFields, CreateFields>>
  ) =>
  (validator: TypeC<P>) =>
  (validateFn: (v: TypeOf<P[K]>) => E.Either<Error, TypeOf<P[K]>>) =>
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await pipe(
      // validate type
      validator.decode(req.body),

      // 将 Errors 转换成 Error 便于后续 composition
      E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),

      // validate value
      // 只需要对 values 进行值验证. options 无需进行进行值验证.
      E.chainFirst((a) => validateFn(a.values)),

      // Either -> TaskEither
      TE.fromEither,

      // compose 创建记录
      TE.chain((d) =>
        TE.tryCatch(() => Model.update(d.values, d.options), Error)
      ),

      // destructor
      TE.fold(
        // 返回错误结果
        (e) => async () => res.status(290).json(String(e)),
        // 返回创建记录结果
        (d) => async () => res.status(200).json(d[0])
      )
    )();
  };
