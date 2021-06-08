import { Either, map, mapLeft } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { zipObj } from 'ramda';
import { CompanyCreationFields } from '../sqlite/models';
import { maxLength, minLength, sequenceValidation } from './validations';

const minLenFourOfName = minLength(4);
const maxLenThirtyOfName = maxLength(30);
const minLenTwoOfAbbr = minLength(2);
const maxLenSixOfName = maxLength(6);

export const validateName = (name: string) =>
  pipe(
    sequenceValidation(minLenFourOfName(name), maxLenThirtyOfName(name)),
    map(() => name)
  );

export const validateAbbr = (abbr: string) =>
  pipe(
    sequenceValidation(minLenTwoOfAbbr(abbr), maxLenSixOfName(abbr)),
    map(() => abbr)
  );

export const validateCompany = (
  company: CompanyCreationFields
): Either<Error, CompanyCreationFields> =>
  pipe(
    // Either<NonEmptyArray<string>, string[]>
    sequenceValidation(validateName(company.name), validateAbbr(company.abbr)),
    // Either<Error, string[]>
    mapLeft((e) => new Error(e.join('\n'))),
    // Either<Error, CompanyCreationFields>
    map(zipObj<keyof CompanyCreationFields>(['name', 'abbr']))
  );
