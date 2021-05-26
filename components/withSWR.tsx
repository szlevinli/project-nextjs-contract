import { ioEither as IE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { is } from 'ramda';
import React from 'react';
import Err from './Err';
import Loading from './Loading';

export const withSWR =
  <Data, Error, Props>(ioEitherSWR: IE.IOEither<Error | string, Data>) =>
  (Component: React.FC<Props>) =>
  (props: Props) =>
    pipe(
      ioEitherSWR,
      IE.match(
        (e) => (is(String, e) ? <Loading /> : <Err error={String(e)} />),
        (data) => <Component {...props} data={data} />
      )
    )();
