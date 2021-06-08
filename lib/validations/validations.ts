import {
  Either,
  left,
  right,
  getApplicativeValidation,
  Apply,
} from 'fp-ts/Either';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { getSemigroup } from 'fp-ts/NonEmptyArray';
import { sequenceT, sequenceS } from 'fp-ts/Apply';

export const minLength =
  (min: number) =>
  (str: string): Either<NonEmptyArray<string>, string> =>
    str.length >= min ? right(str) : left([`最少 ${min} 个字符`]);

export const maxLength =
  (max: number) =>
  (str: string): Either<NonEmptyArray<string>, string> =>
    str.length <= max ? right(str) : left([`最多 ${max} 个字符`]);

export const sequenceValidationT = sequenceT(
  getApplicativeValidation(getSemigroup<string>())
);

export const sequenceValidationS = sequenceS(Apply);
