import { pipe } from 'fp-ts/function';
import Companies, { CompaniesProps } from '../components/Companies';
import withSWR from '../components/withSWR';
import withHandler from '../components/withHandler';
import { getFetcher } from '../lib/axios/fetcher';
import { ioSwr } from '../lib/utils/withFetcher';

const handleAddCompany: CompaniesProps['handleAddCompany'] = ({ name, abbr }) =>
  console.log(`add company: ${name} ${abbr}`);

const swr = ioSwr<string[], unknown>('/api/getCompanies')(getFetcher);

const CompanyPage = pipe(
  Companies,
  withSWR(swr),
  withHandler('handleAddCompany')(handleAddCompany)
);

export default CompanyPage;
