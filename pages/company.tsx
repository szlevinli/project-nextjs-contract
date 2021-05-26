import axios from 'axios';
import { pipe } from 'fp-ts/function';
import { mutate } from 'swr';
import Companies, { CompaniesProps } from '../components/Companies';
import withHandler from '../components/withHandler';
import { withSWR } from '../components/withSWR';
import { getFetcher } from '../lib/axios/fetcher';
import { liftSWR } from '../lib/utils/lift';

const handleAddCompany: CompaniesProps['handleAddCompany'] = async ({
  name,
  abbr,
}) => {
  const res = await axios.post('/api/addCompany', { name, abbr });
  mutate('/api/getCompanies');
};

const ioEitherData = liftSWR<string[], string>('/api/getCompanies')(getFetcher);

const CompanyPage = pipe(
  Companies,
  withSWR(ioEitherData),
  withHandler('handleAddCompany')(handleAddCompany)
);

export default CompanyPage;
