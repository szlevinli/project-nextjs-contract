import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Props, TypeC } from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'ramda';
import { Model, ModelCtor } from 'sequelize';

export const deleteRecord =
  <AllFields, CreateFields, P extends Props>(
    Model: ModelCtor<Model<AllFields, CreateFields>>
  ) =>
  (validator: TypeC<P>) =>
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await pipe(
      validator.decode(req.body),
      E.mapLeft((e) => pipe(e, formatValidationErrors, join('\n'), Error)),
      TE.fromEither,
      TE.chain((d) => TE.tryCatch(() => Model.destroy(d), Error)),
      TE.fold(
        (e) => async () => res.status(290).json(String(e)),
        (d) => async () => res.status(200).json(d)
      )
    )();
  };
