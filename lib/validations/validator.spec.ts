import { DeleteCompanyValidator } from './validator';
import { isLeft, isRight } from 'fp-ts/Either';

it('should be Right', () => {
  const result = DeleteCompanyValidator.decode({
    where: {
      id: 1,
    },
  });
  expect(isRight(result)).toBeTruthy();
});

it('should be Left', () => {
  const result = DeleteCompanyValidator.decode({
    where: {
      id: 1,
      name: 15,
    },
  });
  expect(isLeft(result)).toBeTruthy();
});
