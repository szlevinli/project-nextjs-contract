import * as io from 'io-ts';
import * as t from 'io-ts-types';
import { CommonFields, CompanyCreateFields } from '../sqlite/models';

export const ActivityValidator = io.type({
  startTime: io.string,
  title: io.string,
  minuteCount: io.number,
});

export const ActivityArrayValidator = io.array(ActivityValidator);

export type Activity = io.TypeOf<typeof ActivityValidator>;
export type ActivityArray = io.TypeOf<typeof ActivityArrayValidator>;

//
// Common Fields
//

const CommonFields_: { [key in keyof CommonFields] } = {
  id: io.number,
  createdAt: t.DateFromISOString,
  updatedAt: t.DateFromISOString,
  deletedAt: io.union([t.DateFromISOString, io.nullType]),
};

//
// Company
//

const CompanyCreateFields_: { [key in keyof CompanyCreateFields] } = {
  name: io.string,
  abbr: io.string,
};

export const CompanyValidator = io.type({
  ...CommonFields_,
  ...CompanyCreateFields_,
});
export const CompaniesValidator = io.array(CompanyValidator);

export const AddCompanyValidator = io.type(CompanyCreateFields_);
export const AddCompaniesValidator = io.array(AddCompanyValidator);
