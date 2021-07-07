import { Either, map, mapLeft } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CompanyCreateFields, CompanyUpdateFields } from '../sqlite/models';
import {
  maxLength,
  minLength,
  sequenceValidationS,
  sequenceValidationT,
} from './validations';
import evolve from 'ramda/src/evolve';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';

const minLenFourOfName = minLength(4);
const maxLenThirtyOfName = maxLength(30);
const minLenTwoOfAbbr = minLength(2);
const maxLenSixOfName = maxLength(6);

const transform =
  <A, E>(a: A) =>
  (e: Either<NonEmptyArray<E>, NonEmptyArray<A>>): Either<string, A> =>
    pipe(
      e,
      mapLeft((e) => e.join('\n')),
      map(() => a)
    );

export const validateName = (name: string) =>
  pipe(
    sequenceValidationT(minLenFourOfName(name), maxLenThirtyOfName(name)),
    transform(name)
  );

export const validateAbbr = (abbr: string) =>
  pipe(
    sequenceValidationT(minLenTwoOfAbbr(abbr), maxLenSixOfName(abbr)),
    transform(abbr)
  );

export const CompanyValidations = {
  name: validateName,
  abbr: validateAbbr,
};

export const validateCompany = (
  company: CompanyCreateFields
): Either<Error, CompanyCreateFields> =>
  pipe(
    // Either<NonEmptyArray<string>, CompanyCreationFields>
    sequenceValidationS(evolve(CompanyValidations)(company)),
    // Either<Error, string[]>
    mapLeft(Error)
  );

export const validateCompanyForUpdate = (
  company: Partial<CompanyUpdateFields>
): Either<Error, Partial<CompanyUpdateFields>> =>
  pipe(
    // Either<NonEmptyArray<string>, CompanyCreationFields>
    sequenceValidationS(evolve(CompanyValidations)(company)),
    // Either<Error, string[]>
    mapLeft(Error)
  );
