import { Either, map, mapLeft } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CompanyCreateFields } from '../sqlite/models';
import {
  maxLength,
  minLength,
  sequenceValidationS,
  sequenceValidationT,
} from './validations';

const minLenFourOfName = minLength(4);
const maxLenThirtyOfName = maxLength(30);
const minLenTwoOfAbbr = minLength(2);
const maxLenSixOfName = maxLength(6);

export const validateName = (name: string) =>
  pipe(
    sequenceValidationT(minLenFourOfName(name), maxLenThirtyOfName(name)),
    mapLeft((e) => e.join('\n')),
    map(() => name)
  );

export const validateAbbr = (abbr: string) =>
  pipe(
    sequenceValidationT(minLenTwoOfAbbr(abbr), maxLenSixOfName(abbr)),
    mapLeft((e) => e.join('\n')),
    map(() => abbr)
  );

export const validateCompany = (
  company: CompanyCreateFields
): Either<Error, CompanyCreateFields> =>
  pipe(
    // Either<NonEmptyArray<string>, CompanyCreationFields>
    sequenceValidationS({
      name: validateName(company.name),
      abbr: validateAbbr(company.abbr),
    }),
    // Either<Error, string[]>
    mapLeft((e) => new Error(e))
  );
