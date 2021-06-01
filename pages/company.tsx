import axios, { AxiosResponse } from 'axios';
import { task as T } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { mutate } from 'swr';
import Companies, { AddCompany } from '../components/Companies';
import withHandler from '../components/withHandler';
import { withSWR } from '../components/withSWR';
import { getFetcher } from '../lib/axios/fetcher';
import { CompanyFields } from '../lib/sqlite/models';
import { getHandler } from '../lib/utils/handler';
import { liftSWR } from '../lib/utils/lift';

// ----------------------------------------------------------------------------
// common function
// ----------------------------------------------------------------------------

const onRejectedWhenMutateCompany = <T,>(reason: T) =>
  new Error(String(reason));

const onRightWhenMutateCompany = () => mutate('/api/getCompanies');

const getCompanyHandler = getHandler(onRejectedWhenMutateCompany)(
  onRightWhenMutateCompany
);

// ----------------------------------------------------------------------------
// add company
// ----------------------------------------------------------------------------

const addCompany =
  (company: AddCompany): T.Task<AxiosResponse> =>
  () =>
    axios.post('/api/addCompany', company);

const onLeftAdd = <E,>(e: E) => console.log(`handleAddCompany error ${e}`);

const handleAddCompany = (company: AddCompany) =>
  getCompanyHandler(onLeftAdd)(addCompany(company));

// ----------------------------------------------------------------------------
// delete all companies
// ----------------------------------------------------------------------------

const delAllCompanies = () => axios.post('/api/delAllCompanies');

const onLeftDelAll = <E,>(e: E) =>
  console.log(`handleDeleteAllCompanies error ${e}`);

const handlerDelAllCompanies = () =>
  getCompanyHandler(onLeftDelAll)(delAllCompanies);

// ----------------------------------------------------------------------------
// query company
// ----------------------------------------------------------------------------

const ioEitherData =
  liftSWR<CompanyFields[], string>('/api/getCompanies')(getFetcher);

// ----------------------------------------------------------------------------
// computation
// ----------------------------------------------------------------------------

const CompanyPage = pipe(
  Companies,
  withSWR(ioEitherData),
  withHandler('handleAddCompany')(handleAddCompany),
  withHandler('handleDelAllCompanies')(handlerDelAllCompanies)
);

export default CompanyPage;
