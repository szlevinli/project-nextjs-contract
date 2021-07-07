import { isLeft, isRight } from 'fp-ts/Either';
import { DeleteCompanyValidator, UpdateCompanyValidator } from './validator';

it('[DeleteCompanyValidator]: should be Right', () => {
  const result = DeleteCompanyValidator.decode({
    where: {
      id: 1,
    },
  });
  expect(isRight(result)).toBeTruthy();
});

it('[DeleteCompanyValidator]: should be Left', () => {
  const result = DeleteCompanyValidator.decode({
    where: {
      id: 1,
      name: 15,
    },
  });
  expect(isLeft(result)).toBeTruthy();
});

it('[UpdateCompanyValidator]: should be Right', () => {
  const body = {
    values: {
      name: 'name1',
      abbr: 'abbr1',
    },
    options: {
      where: {
        id: 1,
      },
    },
  };
  const result = UpdateCompanyValidator.decode(body);
  expect(isRight(result)).toBeTruthy();
});

it('[UpdateCompanyValidator]: should be Left', () => {
  const body = {
    values: {
      name: 'name1',
      abbr: 15,
    },
    options: {
      where: {
        id: 'id01',
      },
    },
  };
  const result = UpdateCompanyValidator.decode(body);
  expect(isLeft(result)).toBeTruthy();
});
