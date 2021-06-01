import { Either, fold, left, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Type } from 'io-ts';
import reporter from 'io-ts-reporters';
import useSWR from 'swr';
import { Fetcher } from 'swr/dist/types';

export const useFetchJsonWithSwr =
  <T, O, I>(url: string) =>
  (fetcher: Fetcher<I>) =>
  (validator: Type<T, O, I>): Either<Error, T> => {
    const { data, error } = useSWR<I, Error>(url, fetcher);

    if (error) return left<Error, T>(new Error(String(error)));

    if (!data) return left<Error, T>(null);

    const result = validator.decode(data);

    const onLeft = () => {
      const message = reporter.report(result);
      return left<Error, T>(new Error(message.join('\n')));
    };
    const onRight = (value: T) => right<Error, T>(value);

    return pipe(result, fold(onLeft, onRight));
  };
