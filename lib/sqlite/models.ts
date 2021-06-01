import { pipe } from 'fp-ts/function';
import {
  DataTypes,
  Model,
  ModelAttributeColumnOptions,
  ModelAttributes,
  ModelOptions,
} from 'sequelize';
import db from './db';

const createTable =
  <T>(tableName: string) =>
  (tableOptions: ModelOptions<Model<T>>) =>
  (fields: ModelAttributes<Model<T>>) =>
    db.define<Model<T>>(tableName, fields, tableOptions);

const addField =
  <T>(fieldName: keyof T) =>
  (fieldOptions: ModelAttributeColumnOptions<Model<T>>) =>
  (fields: ModelAttributes<Model<T>> | {}): ModelAttributes<Model<T>> => ({
    ...fields,
    [fieldName]: fieldOptions,
  });

//
// Common
//

export type CommonFields = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

//
// Model: Company
//

export type CompanyCreationFields = {
  name: string;
  abbr: string;
};

export type CompanyFields = CommonFields & CompanyCreationFields;

const companyTable = createTable<CompanyCreationFields>('Company')({
  modelName: 'Companies',
});

const nameField = addField<CompanyCreationFields>('name')({
  type: DataTypes.STRING,
});
const abbrField = addField<CompanyCreationFields>('abbr')({
  type: DataTypes.STRING,
});

export const Company = pipe({}, nameField, abbrField, companyTable);
