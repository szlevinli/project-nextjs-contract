import { validateText, minLength, oneNumber } from './validations';
import { fold } from 'fp-ts/Either';

it('应该返回两个错误信息', () => {
  const str = 'ab';
  const minSixLength = minLength(6)(str);
  const oneNumber_ = oneNumber(str);
  const result = validateText([minSixLength, oneNumber_])(str);

  const value = fold(
    (e) => e,
    (a) => a
  )(result);

  expect(value).toHaveLength(2);
});

it('应该返回一个错误信息', () => {
  const str = 'abcdef';
  const minSixLength = minLength(6)(str);
  const oneNumber_ = oneNumber(str);
  const result = validateText([minSixLength, oneNumber_])(str);

  const value = fold(
    (e) => e,
    (a) => a
  )(result);

  expect(value).toHaveLength(1);
});

it('应该返回输入的值, 即满足所有验证', () => {
  const str = 'abcd2ef';
  const minSixLength = minLength(6)(str);
  const oneNumber_ = oneNumber(str);
  const result = validateText([minSixLength, oneNumber_])(str);

  const value = fold(
    (e) => e,
    (a) => a
  )(result);

  expect(value).toBe(str);
});
