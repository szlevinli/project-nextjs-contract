import { Button } from '@material-ui/core';
import { find, propEq } from 'ramda';
import React, { ChangeEvent } from 'react';
import { FormDialog } from '../components/Company';
import { CompanyFields, CompanyCreationFields } from '../lib/sqlite/models';
import { ACTION } from '../lib/utils/const';

export type CompaniesProps = {
  data: CompanyFields[];
  handleAddCompany: (company: CompanyCreationFields) => Promise<any>;
  handleDelAllCompanies: () => Promise<unknown>;
};

const Companies: React.FC<CompaniesProps> = ({
  data,
  handleAddCompany,
  handleDelAllCompanies,
}) => {
  const [name, setName] = React.useState('');
  const [abbr, setAbbr] = React.useState('');
  const refCompanyName = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] =
    React.useState<null | CompanyFields>(null);
  const [handleSubmit, setHandleSubmit] = React.useState(() => () => {
    console.log(`handle ok`);
  });
  const [action, setAction] = React.useState(ACTION.CREATE);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAbbrChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAbbr(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const add = () => {
    handleAddCompany({ name, abbr });
    clearInputText();
    refCompanyName.current.focus();
  };

  const modify = (id: number) => {
    const value = find<CompanyFields>(propEq('id', id))(data);
    console.log(value);
    setSelectedCompany(value);
    setHandleSubmit(() => () => {
      setOpen(false);
    });
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
    clearInputText();
    refCompanyName.current.focus();
  };

  const clearInputText = () => [setName, setAbbr].forEach((fn) => fn(''));

  return (
    <div>
      <h1>Company</h1>
      <label htmlFor="companyName">企业名称:</label>
      <input
        type="text"
        id="companyName"
        name="companyName"
        value={name}
        onChange={handleNameChange}
        ref={refCompanyName}
      />
      <label htmlFor="companyAbbr">企业简称:</label>
      <input
        type="text"
        id="companyAbbr"
        name="companyAbbr"
        value={abbr}
        onChange={handleAbbrChange}
      />
      <button onClick={add}>Add</button>
      <button onClick={deleteAll}>Del All</button>
      <button onClick={handleOpen}>Open Dialog</button>
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
