import axios, { AxiosResponse } from 'axios';
import { task as T, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { mutate } from 'swr';
import Companies, { AddCompany } from '../components/Companies';
import withHandler from '../components/withHandler';
import { withSWR } from '../components/withSWR';
import { getFetcher } from '../lib/axios/fetcher';
import { liftSWR } from '../lib/utils/lift';

const addCompany =
  (company: AddCompany): T.Task<AxiosResponse> =>
  () =>
    axios.post('/api/addCompany', company);

const onRejectedWhenAddCompany = <T,>(reason: T) => new Error(String(reason));

const handleAddCompany = async (company: AddCompany) => {
  const result = TE.tryCatch(addCompany(company), onRejectedWhenAddCompany);
  const compute = pipe(
    result,
    TE.match(
      (e) => console.log(`handleAddCompany error ${e}`),
      () => {
        mutate('/api/getCompanies');
      }
    )
  );
  await compute();
};

const ioEitherData = liftSWR<string[], string>('/api/getCompanies')(getFetcher);

const CompanyPage = pipe(
  Companies,
  withSWR(ioEitherData),
  withHandler('handleAddCompany')(handleAddCompany)
);

export default CompanyPage;
