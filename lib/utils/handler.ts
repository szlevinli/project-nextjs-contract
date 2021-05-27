import { taskEither as TE } from 'fp-ts';
import { Lazy, pipe } from 'fp-ts/function';

export const getHandler =
  <E, A, B>(onRejected: (reason: unknown) => E) =>
  (onRight: (a: A) => B) =>
  (onLeft: (e: E) => B) =>
  async (f: Lazy<Promise<A>>) =>
    await pipe(TE.tryCatch(f, onRejected), TE.match(onLeft, onRight))();
