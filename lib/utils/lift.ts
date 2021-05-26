import { either as E, io as IO, ioEither as IE } from 'fp-ts';
import useSWR, { SWRResponse } from 'swr';

export const liftSWR =
  <Data, Error>(apiUrl: string) =>
  (
    fetcher: (url: string) => Promise<Data>
  ): IE.IOEither<Error | string, Data> =>
  () => {
    const { data, error } = useSWR<Data, Error>(apiUrl, fetcher);
    if (error) return E.left(error);
    if (!data) return E.left('Loading');
    return E.right(data);
  };
