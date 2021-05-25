import { either as E, io as IO, ioEither as IE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import React from 'react';
import { SWRResponse } from 'swr';
import { ioEitherSwr } from '../lib/utils/withFetcher';
import Err from './Err';
import Loading from './Loading';

const withSWR =
  <Data, Error>(ioSwr: IO.IO<SWRResponse<Data, Error>>) =>
  (Component: React.FC<Record<string, unknown> & { data: Data }>) =>
  (props: Record<string, unknown>) =>
    pipe(
      ioSwr,
      ioEitherSwr,
      IE.match(
        (e) => <Err error={String(e)} />,
        (d) =>
          pipe(
            d,
            E.match(
              () => <Loading />,
              (data) => <Component data={data} {...props} />
            )
          )
      )
    )();

export default withSWR;
