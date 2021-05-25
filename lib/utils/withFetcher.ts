import { either as E, io as IO, ioEither as IE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import useSWR, { SWRResponse } from 'swr';

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
