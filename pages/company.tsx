import Company from '../components/Company';
import withComponent from '../components/withComponent';
import { getFetcher } from '../lib/axios/fetcher';
import { ioSwr } from '../lib/utils/withFetcher';

const swr = ioSwr<string[], unknown>('/api/getCompanies')(getFetcher);
const CompanyPage = withComponent(Company)(swr);
export default CompanyPage;
