import { Either, fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { isNil } from 'ramda';

export type RemoteProps<T> = {
  data: Either<Error, T>;
  loading: () => JSX.Element;
  error: (error: Error) => JSX.Element;
  success: (data: T) => JSX.Element;
};

const Remote = <T,>({ data, loading, error, success }: RemoteProps<T>) =>
  pipe(
    data,
    fold(
      (e) => (isNil(e) ? loading() : error(e)),
      (data) => success(data)
    )
  );

export default Remote;
