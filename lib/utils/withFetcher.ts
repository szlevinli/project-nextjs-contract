import React from 'react';
import useSWR, { SWRResponse } from 'swr';
import { io as IO, ioEither as IE, either as E } from 'fp-ts';
import { pipe } from 'fp-ts/function';

export const withFetcher =
  <T>(apiUrl: string) =>
  (fetcher: (url: string) => Promise<T>) =>
  (Component: React.FC<Record<string, unknown> & { data: T }>) =>
  (props: Record<string, unknown>) => {
    const { data, error } = useSWR<T>(apiUrl, fetcher);

    if (error) return React.createElement('div', null, `Error: ${error}`);
    if (!data) return React.createElement('div', null, 'loading...');

    return React.createElement(Component, { ...props, data });
  };

// const getDataFromApi =
//   <Data, Error>(apiUrl: string) =>
//   (fetcher: (url: string) => Promise<Data>): IO.IO<SWRResponse<Data, Error>> =>
//   () =>
//     useSWR<Data>(apiUrl, fetcher);

export const ioSwr =
  <Data, Error>(apiUrl: string) =>
  (fetcher: (url: string) => Promise<Data>): IO.IO<SWRResponse<Data, Error>> =>
  () =>
    useSWR<Data>(apiUrl, fetcher);

export const ioEitherSwr = <Data, Error>(
  fa: IO.IO<SWRResponse<Data, Error>>
): IE.IOEither<Error, E.Either<any, Data>> =>
  pipe(
    fa,
    IO.map((sw) =>
      sw.error
        ? E.left(sw.error)
        : sw.data
        ? E.right(E.right(sw.data))
        : E.right(E.left(undefined))
    )
  );

// export const kkk =
//   <Data, Error>(fa: IO.IO<SWRResponse<Data, Error>>) =>
//   (Component: React.FC<Record<string, unknown> & { data: Data }>) =>
//   (props: Record<string, unknown>): IE.IOEither<JSX.Element, JSX.Element> =>
//     pipe(
//       fa,
//       IO.map((sw) =>
//         sw.error
//           ? E.left(React.createElement('div', null, `Error: ${sw.error}`))
//           : sw.data
//           ? E.right(React.createElement(Component, { ...props, data: sw.data }))
//           : E.left(React.createElement('div', null, 'loading...'))
//       )
//     );
