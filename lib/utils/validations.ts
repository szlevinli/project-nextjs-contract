import { sequenceT } from 'fp-ts/Apply';
import {
  Either,
  getApplicativeValidation,
  left,
  map,
  right,
} from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getSemigroup, NonEmptyArray } from 'fp-ts/NonEmptyArray';

export const minLength =
  (min: number) =>
  (str: string): Either<NonEmptyArray<string>, string> =>
    str.length >= min ? right(str) : left([`最少 ${min} 个字符`]);

export const maxLength =
  (max: number) =>
  (str: string): Either<NonEmptyArray<string>, string> =>
    str.length <= max ? right(str) : left([`最多 ${max} 个字符`]);

export const oneNumber = (str: string): Either<NonEmptyArray<string>, string> =>
  /[0-9]/g.test(str) ? right(str) : left(['最少 1 个数字']);

export const validateText =
  (validations: NonEmptyArray<Either<NonEmptyArray<string>, string>>) =>
  (str: string) =>
    pipe(
      sequenceT(getApplicativeValidation(getSemigroup<string>()))(
        validations[0],
        ...validations.slice(1)
      ),
      map(() => str)
    );
