import React, { ChangeEvent, ChangeEventHandler } from 'react';

export type CompaniesProps = {
  data: string[];
  handleAddCompany: (company: { name: string; abbr: string }) => void;
};

const Companies: React.FC<CompaniesProps> = ({ data, handleAddCompany }) => {
  const [name, setName] = React.useState('');
  const [abbr, setAbbr] = React.useState('');

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAbbrChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAbbr(event.target.value);
  };

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
      />
      <label htmlFor="companyAbbr">企业简称:</label>
      <input
        type="text"
        id="companyAbbr"
        name="companyAbbr"
        value={abbr}
        onChange={handleAbbrChange}
      />
      <button onClick={() => handleAddCompany({ name, abbr })}>Add</button>
      <ul>
        {data.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
};

export default Companies;
