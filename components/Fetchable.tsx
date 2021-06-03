import { Type } from 'io-ts';
import { Fetcher } from 'swr/dist/types';
import { useFetchJsonWithSwr } from '../lib/utils/fetchJsonWithSwr';
import Remote from './Remote';

export type FetchableProps<T, O, I> = {
  url: string;
  fetcher: Fetcher<I>;
  validator: Type<T, O, I>;
  loading: () => JSX.Element;
  error: (error: Error) => JSX.Element;
  success: (data: T) => JSX.Element;
};

const Fetchable = <T, O, I>({
  url,
  fetcher,
  validator,
  loading,
  error,
  success,
}: FetchableProps<T, O, I>) => {
  const data = useFetchJsonWithSwr<T, O, I>(url)(fetcher)(validator);

  return (
    <Remote<T> loading={loading} error={error} data={data} success={success} />
  );
};

export default Fetchable;
