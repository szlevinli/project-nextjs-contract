import * as io from 'io-ts';
import * as t from 'io-ts-types';

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

const CommonFields = {
  id: io.number,
  createdAt: t.DateFromISOString,
  updatedAt: t.DateFromISOString,
};

//
// Company
//

const CompanyFields = {
  name: io.string,
  abbr: io.string,
};

export const CompanyValidator = io.type({ ...CommonFields, ...CompanyFields });
export const CompaniesValidator = io.array(CompanyValidator);

export const AddCompanyValidator = io.type(CompanyFields);
export const AddCompaniesValidator = io.array(AddCompanyValidator);
