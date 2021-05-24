import useSWR from 'swr';
import { Company as CompanyT } from '../lib/sqlite/models';
import { GetStaticProps } from 'next';
import { Model } from 'sequelize';
import { getFetcher } from '../lib/axios/fetcher';

// type CompanyProps = {
//   companies: string[];
// };

// const Company: React.FC<CompanyProps> = ({ companies }) => {
//   return (
//     <div>
//       <h2>Company</h2>
//       <ul>
//         {companies.map((v, i) => (
//           <li key={i}>{v}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export const getStaticProps: GetStaticProps = async () => {
//   const all = await CompanyT.findAll();

//   return {
//     props: {
//       companies: all.map((v) => JSON.stringify(v)),
//     },
//   };
// };

const Company: React.FC = ({}) => {
  const { data, error } = useSWR<string[]>('/api/getCompanies', getFetcher);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

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
