import * as io from 'io-ts';
import * as t from 'io-ts-types';
import { DestroyOptions } from 'sequelize';
import {
  CommonFields,
  CompanyAllFields,
  CompanyCreateFields,
  CompanyUpdateFields,
  PkFields,
} from '../sqlite/models';

//
// Helper For Type Define
//

type ObjectWithSpecifiedKeys<T> = { [key in keyof T] };

//
// Common Fields
//

const PkFields_: ObjectWithSpecifiedKeys<PkFields> = {
  id: io.number,
};

const CommonFields_: ObjectWithSpecifiedKeys<CommonFields> = {
  ...PkFields_,
  createdAt: t.DateFromISOString,
  updatedAt: t.DateFromISOString,
  deletedAt: io.union([t.DateFromISOString, io.nullType]),
};

//
// Company
//

// Create
const CompanyCreateFields_: ObjectWithSpecifiedKeys<CompanyCreateFields> = {
  name: io.string,
  abbr: io.string,
};

export const CreateCompanyValidator = io.type(CompanyCreateFields_);
export const CreateCompaniesValidator = io.array(CreateCompanyValidator);

// All
const CompanyAllFields_: ObjectWithSpecifiedKeys<CompanyAllFields> = {
  ...CommonFields_,
  ...CompanyCreateFields_,
};

export const CompanyValidator = io.type(CompanyAllFields_);
export const CompaniesValidator = io.array(CompanyValidator);

// Update
const CompanyUpdateFields_: ObjectWithSpecifiedKeys<CompanyUpdateFields> = {
  ...PkFields_,
  ...CompanyCreateFields_,
};

export const UpdateCompanyValidator = io.type(CompanyUpdateFields_);
export const UpdateCompaniesValidator = io.array(UpdateCompanyValidator);

// Delete
const CompanyDestroyOptions: ObjectWithSpecifiedKeys<
  DestroyOptions<CompanyAllFields>
> = {
  where: io.partial(CompanyValidator.props),
};

export const DeleteCompanyValidator = io.type(CompanyDestroyOptions);
export const DeleteCompaniesValidator = io.array(DeleteCompanyValidator);
