import { Button } from '@material-ui/core';
import { find, propEq } from 'ramda';
import React from 'react';
import { UpdateOptions } from 'sequelize';
import { FormDialog } from '../components/Company';
import {
  CompanyAllFields,
  CompanyCreateFields,
  CompanyUpdateFields,
} from '../lib/sqlite/models';
import {
  create as createProps,
  del as deleteProps,
  modify as modifyProps,
} from '../lib/utils/componentHelper';
import { ACTION } from '../lib/utils/const';

export type CompaniesProps = {
  data: CompanyAllFields[];
  handleAddCompany: (company: CompanyCreateFields) => Promise<any>;
  handleUpdateCompany: (
    updateCompany: CompanyUpdateFields,
    updateOptions: UpdateOptions<CompanyAllFields>
  ) => Promise<any>;
  handleDeleteCompany: (
    deleteOptions: UpdateOptions<CompanyAllFields>
  ) => Promise<any>;
};

const Companies: React.FC<CompaniesProps> = ({
  data,
  handleAddCompany,
  handleUpdateCompany,
  handleDeleteCompany,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] =
    React.useState<null | CompanyAllFields>(null);
  const [action, setAction] = React.useState(ACTION.CREATE);

  const handleClose = () => {
    setOpen(false);
  };

  const create = () => {
    setSelectedCompany(null);
    setAction(ACTION.CREATE);
    setOpen(true);
  };

  const modify = (id: number) => {
    const value = find<CompanyAllFields>(propEq('id', id))(data);
    setSelectedCompany(value);
    setAction(ACTION.MODIFY);
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
        componentProps={
          action === ACTION.CREATE
            ? createProps(handleAddCompany)
            : action === ACTION.DELETE
            ? deleteProps(selectedCompany, handleDeleteCompany)
            : modifyProps(selectedCompany, handleUpdateCompany)
        }
      />
    </div>
  );
};

export default Companies;
