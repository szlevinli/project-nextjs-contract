import { isLeft, isRight, left, map, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { maxLength, minLength, sequenceValidation } from './validations';

it('should be return legal data', () => {
  const data = 'hello';

  const minLenIsTwo = minLength(2)(data);
  const maxLenIsSix = maxLength(6)(data);

  const validatedResult = pipe(
    sequenceValidation(minLenIsTwo, maxLenIsSix),
    map(() => data)
  );

  expect(isRight(validatedResult)).toBeTruthy();
  expect(validatedResult).toEqual(right(data));
});

it('should be return failure message when min validation is triggered', () => {
  const data = 'h';

  const minLenIsTwo = minLength(2)(data);
  const maxLenIsSix = maxLength(6)(data);

  const validatedResult = pipe(
    sequenceValidation(minLenIsTwo, maxLenIsSix),
    map(() => data)
  );

  expect(isLeft(validatedResult)).toBeTruthy();
  expect(validatedResult).toEqual(left(['最少 2 个字符']));
});

it('should be return failure message when max validation is triggered', () => {
  const data = 'hello world';

  const minLenIsTwo = minLength(2)(data);
  const maxLenIsSix = maxLength(6)(data);

  const validatedResult = pipe(
    sequenceValidation(minLenIsTwo, maxLenIsSix),
    map(() => data)
  );

  expect(isLeft(validatedResult)).toBeTruthy();
  expect(validatedResult).toEqual(left(['最多 6 个字符']));
});
