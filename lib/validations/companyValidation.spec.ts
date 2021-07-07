import { validateCompanyForUpdate } from './companyValidation';
import { Company, CompanyUpdateFields } from '../../lib/sqlite/models';
import { isRight, isLeft } from 'fp-ts/Either';

it('[validateCompanyForUpdate]: should be return `Right`, when the field in the object is not defined', () => {
  const o: Partial<CompanyUpdateFields> = {
    name: 'company',
  };

  const result = validateCompanyForUpdate(o);

  expect(isRight(result)).toBeTruthy();
});

it('[validateCompanyForUpdate]: should be return `Left`, when invalid field value ', () => {
  const o: Partial<CompanyUpdateFields> = {
    name: 'co',
  };

  const result = validateCompanyForUpdate(o);

  expect(isLeft(result)).toBeTruthy();
});
