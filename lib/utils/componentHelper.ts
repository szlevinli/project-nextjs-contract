import { DestroyOptions, UpdateOptions } from 'sequelize/types';
import { ACTION } from './const';

export type CreateRecordHandler<BusinessFields> = (
  createFields: BusinessFields
) => Promise<unknown>;

export type DeleteRecordHandler<AllFields> = (
  deleteOptions: DestroyOptions<AllFields>
) => Promise<unknown>;

export type UpdateRecordHandler<AllFields, BusinessFields> = (
  updateFields: Partial<BusinessFields>,
  updateOptions: UpdateOptions<AllFields>
) => Promise<unknown>;

export type CRUDHandler<AllFields, BusinessFields> =
  | {
      type: ACTION.CREATE;
      handleSubmit: CreateRecordHandler<BusinessFields>;
    }
  | {
      type: ACTION.DELETE;
      data: AllFields;
      handleSubmit: DeleteRecordHandler<AllFields>;
    }
  | {
      type: ACTION.MODIFY;
      data: AllFields;
      handleSubmit: UpdateRecordHandler<AllFields, BusinessFields>;
    };

export const fold = <AllFields, BusinessFields, R>(
  fa: CRUDHandler<AllFields, BusinessFields>,
  onCreate: (handleSubmit: CreateRecordHandler<BusinessFields>) => R,
  onDelete: (
    data: AllFields,
    handleSubmit: DeleteRecordHandler<AllFields>
  ) => R,
  onModify: (
    data: AllFields,
    handleSubmit: UpdateRecordHandler<AllFields, BusinessFields>
  ) => R
): R =>
  fa.type === ACTION.CREATE
    ? onCreate(fa.handleSubmit)
    : fa.type === ACTION.DELETE
    ? onDelete(fa.data, fa.handleSubmit)
    : onModify(fa.data, fa.handleSubmit);

export const create = <AllFields, BusinessFields>(
  handleSubmit: CreateRecordHandler<BusinessFields>
): CRUDHandler<AllFields, BusinessFields> => ({
  type: ACTION.CREATE,
  handleSubmit,
});

export const del = <AllFields, BusinessFields>(
  data: AllFields,
  handleSubmit: DeleteRecordHandler<AllFields>
): CRUDHandler<AllFields, BusinessFields> => ({
  type: ACTION.DELETE,
  data,
  handleSubmit,
});

export const modify = <AllFields, BusinessFields>(
  data: AllFields,
  handleSubmit: UpdateRecordHandler<AllFields, BusinessFields>
): CRUDHandler<AllFields, BusinessFields> => ({
  type: ACTION.MODIFY,
  data,
  handleSubmit,
});

export const foldPointFree =
  <AllFields, BusinessFields, R>(fa: CRUDHandler<AllFields, BusinessFields>) =>
  (onCreate: (handleSubmit: CreateRecordHandler<BusinessFields>) => R) =>
  (
    onDelete: (
      data: AllFields,
      handleSubmit: DeleteRecordHandler<AllFields>
    ) => R
  ) =>
  (
    onModify: (
      data: AllFields,
      handleSubmit: UpdateRecordHandler<AllFields, BusinessFields>
    ) => R
  ): R =>
    fa.type === ACTION.CREATE
      ? onCreate(fa.handleSubmit)
      : fa.type === ACTION.DELETE
      ? onDelete(fa.data, fa.handleSubmit)
      : onModify(fa.data, fa.handleSubmit);
