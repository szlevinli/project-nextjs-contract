import {
  DataTypes,
  ModelAttributeColumnOptions,
  ModelAttributes,
  ModelOptions,
} from 'sequelize';
import db from './db';
import { pipe } from 'fp-ts/function';

const createTable =
  (tableName: string) =>
  (tableOptions: ModelOptions) =>
  (fields: ModelAttributes) =>
    db.define(tableName, fields, tableOptions);

const addField =
  (fieldName: string) =>
  (fieldOptions: ModelAttributeColumnOptions) =>
  (fields: ModelAttributes | {}): ModelAttributes => ({
    ...fields,
    [fieldName]: fieldOptions,
  });

//
// Model: Company
//

const companyTable = createTable('Company')({ modelName: 'Companies' });

const nameField = addField('name')({ type: DataTypes.STRING });
const abbrField = addField('abbr')({ type: DataTypes.STRING });

export const Company = pipe({}, nameField, abbrField, companyTable);

//
// Create DB
//

// (async () => {
//   await db.sync();
//   console.log(`All models were synchronized successfully.`);
// })();

// TODO: Delete
// (async () => {
//   const all = await Company.findAll();
//   console.log(`Company records:`);
//   all.forEach((v) => console.log(v.toJSON()));

//   const a = await Company.create({
//     name: '招商蛇口',
//     abbr: '招蛇',
//   });
//   console.log(`add new record ${a.toJSON()}`);
// })();

// const Company = db.define(
//   'Company',
//   {
//     name: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     modelName: 'Companies',
//   }
// );
