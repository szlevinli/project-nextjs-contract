import { pipe } from 'fp-ts/function';
import Companies, { CompaniesProps } from '../components/Companies';
import withSWR from '../components/withSWR';
import withHandler from '../components/withHandler';
import { getFetcher, postFetcher } from '../lib/axios/fetcher';
import { ioSwr } from '../lib/utils/withFetcher';
import axios from 'axios';
import { mutate } from 'swr';

const handleAddCompany: CompaniesProps['handleAddCompany'] = async ({
  name,
  abbr,
}) => {
  const res = await axios.post('/api/addCompany', { name, abbr });
  mutate('/api/getCompanies');
};

const swr = ioSwr<string[], unknown>('/api/getCompanies')(getFetcher);

const CompanyPage = pipe(
  Companies,
  withSWR(swr),
  withHandler('handleAddCompany')(handleAddCompany)
);

export default CompanyPage;
