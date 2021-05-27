import React, { ChangeEvent } from 'react';

export type AddCompany = {
  name: string;
  abbr: string;
};

export type CompaniesProps = {
  data: string[];
  handleAddCompany: (company: AddCompany) => Promise<any>;
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

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAbbrChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAbbr(event.target.value);
  };

  const add = () => {
    handleAddCompany({ name, abbr });
    clearInputText();
    refCompanyName.current.focus();
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
      <ul>
        {data.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
};

export default Companies;
