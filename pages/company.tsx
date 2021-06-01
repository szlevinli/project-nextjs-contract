import axios from 'axios';
import { fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { tryCatch } from 'fp-ts/TaskEither';
import { useSnackbar } from 'notistack';
import { mutate } from 'swr';
import Companies, { AddCompany } from '../components/Companies';
import Err from '../components/Err';
import Fetchable from '../components/Fetchable';
import Loading from '../components/Loading';
import { getFetcher } from '../lib/axios/fetcher';
import { CompanyFields } from '../lib/sqlite/models';
import { CompaniesValidator } from '../lib/utils/validator';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const callApi =
  <Body, T>(url: string) =>
  (body: Body) =>
    tryCatch(
      () => axios.post<T>(url, body),
      (err) => new Error(String(err))
    );

const CompanyPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleAddCompany = async (company: AddCompany) => {
    const result = await callApi<AddCompany, CompanyFields>('/api/addCompany')(
      company
    )();
    pipe(
      result,
      fold(
        (err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        },
        () => {
          enqueueSnackbar('add ok', { variant: 'success' });
          mutate('/api/getCompanies');
        }
      )
    );
  };

  const handleDelAllCompanies = async () => {
    const result = await callApi<null, { deleted_number: number }>(
      '/api/delAllCompanies'
    )(null)();
    pipe(
      result,
      fold(
        (err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        },
        (d) => {
          enqueueSnackbar(
            `清空 Companies 表(${d.data.deleted_number} 条记录)`,
            {
              variant: 'success',
            }
          );
          mutate('/api/getCompanies');
        }
      )
    );
  };

  return (
    <Fetchable
      url="/api/getCompanies"
      fetcher={getFetcher}
      validator={CompaniesValidator}
      loading={() => <Loading />}
      error={(err) => <Err error={err} />}
      success={(data) => (
        <Companies
          data={data}
          handleAddCompany={handleAddCompany}
          handleDelAllCompanies={handleDelAllCompanies}
        />
      )}
    />
  );
};

export default withPageAuthRequired(CompanyPage);
