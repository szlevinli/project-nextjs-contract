import { either as E, io as IO, ioEither as IE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import React from 'react';
import { SWRResponse } from 'swr';
import { ioEitherSwr } from '../lib/utils/withFetcher';
import Err from './Err';
import Loading from './Loading';

const withComponent =
  <Data, Error>(
    Component: React.FC<Record<string, unknown> & { data: Data }>
  ) =>
  (ioSwr: IO.IO<SWRResponse<Data, Error>>) =>
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

export default withComponent;
