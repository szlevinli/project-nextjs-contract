import { Either, fold, left, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Type } from 'io-ts';
import reporter from 'io-ts-reporters';

export const fetchJSON =
  <T, O, I>(url: string) =>
  (init?: RequestInit) =>
  async (validator: Type<T, O, I>): Promise<Either<Error, T>> => {
    try {
      const response = await fetch(url, init);
      const json: I = await response.json();
      const result = validator.decode(json);

      const onLeft = () => {
        const message = reporter.report(result);
        return left<Error, T>(new Error(message.join('\n')));
      };
      const onRight = (value: T) => right<Error, T>(value);

      return pipe(result, fold(onLeft, onRight));
    } catch (err) {
      return Promise.resolve(left<Error, T>(new Error(String(err))));
    }
  };
