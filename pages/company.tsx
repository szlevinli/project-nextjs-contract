import Company from '../components/Company';
import withComponentAndSwr from '../components/withComponentAndSwr';
import { getFetcher } from '../lib/axios/fetcher';
import { ioSwr } from '../lib/utils/withFetcher';

const swr = ioSwr<string[], unknown>('/api/getCompanies')(getFetcher);
const CompanyPage = withComponentAndSwr(Company)(swr);
export default CompanyPage;
