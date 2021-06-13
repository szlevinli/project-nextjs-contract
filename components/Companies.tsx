import { Button } from '@material-ui/core';
import { find, propEq } from 'ramda';
import React from 'react';
import { FormDialog } from '../components/Company';
import {
  CompanyAllFields,
  CompanyCreateFields,
  CompanyUpdateFields,
} from '../lib/sqlite/models';
import { ACTION } from '../lib/utils/const';

export type CompaniesProps = {
  data: CompanyAllFields[];
  handleAddCompany: (company: CompanyCreateFields) => Promise<any>;
  handleUpdateCompany: (updateCompany: CompanyUpdateFields) => Promise<any>;
  handleDelAllCompanies: () => Promise<unknown>;
};

const Companies: React.FC<CompaniesProps> = ({
  data,
  handleAddCompany,
  handleUpdateCompany,
  handleDelAllCompanies,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] =
    React.useState<null | CompanyAllFields>(null);
  const [handleSubmit, setHandleSubmit] = React.useState(() => () => {
    console.log(`handle ok`);
  });
  const [action, setAction] = React.useState(ACTION.CREATE);

  const handleClose = () => {
    setOpen(false);
  };

  const modify = (id: number) => {
    const value = find<CompanyAllFields>(propEq('id', id))(data);
    setSelectedCompany(value);
    setHandleSubmit(() => handleUpdateCompany);
    setAction(ACTION.MODIFY);
    setOpen(true);
  };

  const create = () => {
    setSelectedCompany(null);
    setHandleSubmit(() => handleAddCompany);
    setAction(ACTION.CREATE);
    setOpen(true);
  };

  const deleteAll = () => {
    handleDelAllCompanies();
  };

  return (
    <div>
      <h1>Company</h1>
      <button onClick={deleteAll}>Del All</button>
      <Button onClick={create}>New</Button>
      <ul>
        {data.map((v) => (
          <li key={v.id}>
            {v.id}: {JSON.stringify(v)}
            <Button onClick={() => modify(v.id)}>Modify</Button>
          </li>
        ))}
      </ul>
      <FormDialog
        open={open}
        data={selectedCompany}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        action={action}
      />
    </div>
  );
};

export default Companies;
