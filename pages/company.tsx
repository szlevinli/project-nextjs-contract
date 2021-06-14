import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/TaskEither';
import { useSnackbar } from 'notistack';
import { mutate } from 'swr';
import Companies from '../components/Companies';
import Err from '../components/Err';
import Fetchable from '../components/Fetchable';
import Loading from '../components/Loading';
import { getFetcher } from '../lib/axios/fetcher';
import {
  CompanyAllFields,
  CompanyCreateFields,
  CompanyUpdateFields,
  CompanyDeleteFields,
} from '../lib/sqlite/models';
import { callAPI } from '../lib/utils/callAPI';
import { ApiKeys } from '../lib/utils/const';
import { CompaniesValidator } from '../lib/validations/validator';

const callAddCompanyApi = callAPI<CompanyCreateFields, CompanyAllFields>(
  ApiKeys.COMPANY_CREATE
);

const callUpdateCompanyApi = callAPI<CompanyUpdateFields, number>(
  ApiKeys.COMPANY_UPDATE
);

const callDeleteCompanyApi = callAPI<CompanyDeleteFields, number>(
  ApiKeys.COMPANY_DELETE
);

const callDelAllCompaniesApi = callAPI<unknown, { deleted_number: number }>(
  ApiKeys.COMPANY_DELETE_ALL
);

const CompanyPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const callApiFailure = (msg: string) => async () => {
    enqueueSnackbar(msg, { variant: 'error' });
    mutate(ApiKeys.COMPANY_READ);
  };

  const callApiSuccess = (msg: string) => async () => {
    enqueueSnackbar(msg, { variant: 'success' });
    mutate(ApiKeys.COMPANY_READ);
  };

  const handleAddCompany = (company: CompanyCreateFields) =>
    pipe(
      callAddCompanyApi(company),
      fold(
        (e) => callApiFailure(e.message),
        () => callApiSuccess('添加记录成功')
      )
    )();

  const handleUpdateCompany = (updateCompany: CompanyUpdateFields) =>
    pipe(
      callUpdateCompanyApi(updateCompany),
      fold(
        (e) => callApiFailure(e.message),
        (d) => callApiSuccess(`成功更新 ${d.data} 记录`)
      )
    )();

  const handleDeleteCompany = (deleteCompany: CompanyDeleteFields) =>
    pipe(
      callDeleteCompanyApi(deleteCompany),
      fold(
        (e) => callApiFailure(e.message),
        (d) => callApiSuccess(`成功删除 ${d.data} 记录`)
      )
    )();

  const handleDelAllCompanies = () =>
    pipe(
      callDelAllCompaniesApi(),
      fold(
        (e) => callApiFailure(e.message),
        (d) =>
          callApiSuccess(`清空 Companies 表(${d.data.deleted_number} 条记录)`)
      )
    )();

  return (
    <Fetchable
      url={ApiKeys.COMPANY_READ}
      fetcher={getFetcher}
      validator={CompaniesValidator}
      loading={() => <Loading />}
      error={(err) => <Err error={err} />}
      success={(data) => (
        <Companies
          data={data}
          handleAddCompany={handleAddCompany}
          handleUpdateCompany={handleUpdateCompany}
          handleDeleteCompany={handleDeleteCompany}
          handleDelAllCompanies={handleDelAllCompanies}
        />
      )}
    />
  );
};

export default withPageAuthRequired(CompanyPage);
