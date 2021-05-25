type CompanyProps = {
  data: string[];
};

const Company: React.FC<CompanyProps> = ({ data }) => {
  return (
    <div>
      <h1>Company</h1>
      <ul>
        {data.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
};

export default Company;
