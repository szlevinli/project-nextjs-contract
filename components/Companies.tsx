import { Button } from '@material-ui/core';
import { find, propEq } from 'ramda';
import React from 'react';
import { FormDialog } from '../components/Company';
import { CompanyAllFields, CompanyCreateFields } from '../lib/sqlite/models';
import {
  create as createProps,
  CreateRecordHandler,
  CRUDComponentProps,
  DeleteRecordHandler,
  modify as modifyProps,
  UpdateRecordHandler,
} from '../lib/utils/componentHelper';
import { pipe } from 'fp-ts/function';

export type CompaniesProps = {
  data: CompanyAllFields[];
  handleAddCompany: CreateRecordHandler<CompanyCreateFields>;
  handleUpdateCompany: UpdateRecordHandler<
    CompanyAllFields,
    CompanyCreateFields
  >;
  handleDeleteCompany: DeleteRecordHandler<CompanyAllFields>;
};

const Companies: React.FC<CompaniesProps> = ({
  data,
  handleAddCompany,
  handleUpdateCompany,
  handleDeleteCompany,
}) => {
  const [open, setOpen] = React.useState(false);
  const [componentProps, setComponentProps] =
    React.useState<CRUDComponentProps<CompanyAllFields, CompanyCreateFields>>(
      null
    );

  const handleClose = () => {
    setOpen(false);
  };

  const create = () => {
    pipe(handleAddCompany, createProps, setComponentProps);
    setOpen(true);
  };

  const modify = (id: number) => {
    const value = find<CompanyAllFields>(propEq('id', id))(data);
    setComponentProps(modifyProps(value, handleUpdateCompany));
    setOpen(true);
  };

  return (
    <div>
      <h1>Company</h1>
      <Button onClick={create}>New</Button>
      <ul>
        {data.map((v) => (
          <li key={v.id}>
            {v.id}: {JSON.stringify(v)}
            <Button onClick={() => modify(v.id)}>Modify</Button>
            <Button
              onClick={() => handleDeleteCompany({ where: { id: v.id } })}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <FormDialog
        open={open}
        handleClose={handleClose}
        componentProps={componentProps}
      />
    </div>
  );
};

export default Companies;
