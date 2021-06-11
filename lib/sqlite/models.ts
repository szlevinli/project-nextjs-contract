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

export interface PkFields {
  id: number;
}

export interface CommonFields extends PkFields {
  createdAt: Date;
  updatedAt: Date;
}

export type AllFields<T> = CommonFields & T;

export type CreateFields<T> = T;

export type UpdateFields<T> = PkFields & T;

export type DeleteFields = PkFields;

//
// Model: Company
//

export type CompanyFields = {
  name: string;
  abbr: string;
};

export type CompanyCreateFields = CreateFields<CompanyFields>;

export type CompanyAllFields = AllFields<CompanyFields>;

export type CompanyUpdateFields = UpdateFields<CompanyFields>;

export type CompanyDeleteFields = DeleteFields;

const companyTable = createTable<CompanyCreateFields>('Company')({
  modelName: 'Companies',
});

const nameField = addField<CompanyCreateFields>('name')({
  type: DataTypes.STRING,
  allowNull: false,
});
const abbrField = addField<CompanyCreateFields>('abbr')({
  type: DataTypes.STRING,
  allowNull: false,
});

export const Company = pipe({}, nameField, abbrField, companyTable);
