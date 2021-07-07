import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/TaskEither';
import { useSnackbar } from 'notistack';
import { DestroyOptions, UpdateOptions } from 'sequelize';
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
} from '../lib/sqlite/models';
import { callAPI } from '../lib/utils/callAPI';
import {
  CreateRecordHandler,
  DeleteRecordHandler,
  UpdateRecordHandler,
} from '../lib/utils/componentHelper';
import { ApiKeys } from '../lib/utils/const';
import { CompaniesValidator } from '../lib/validations/validator';

const callAddCompanyApi = callAPI<CompanyCreateFields, CompanyAllFields>(
  ApiKeys.COMPANY_CREATE
);

const callUpdateCompanyApi = callAPI<
  { values: CompanyUpdateFields; options: UpdateOptions<CompanyAllFields> },
  number
>(ApiKeys.COMPANY_UPDATE);

const callDeleteCompanyApi = callAPI<DestroyOptions<CompanyAllFields>, number>(
  ApiKeys.COMPANY_DELETE
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

  const handleAddCompany: CreateRecordHandler<CompanyCreateFields> = (
    company
  ) =>
    pipe(
      callAddCompanyApi(company),
      fold(
        (e) => callApiFailure(e.message),
        () => callApiSuccess('添加记录成功')
      )
    )();

  const handleUpdateCompany: UpdateRecordHandler<
    CompanyAllFields,
    CompanyCreateFields
  > = (updateCompany, updateOptions) =>
    pipe(
      callUpdateCompanyApi({
        values: updateCompany,
        options: updateOptions,
      }),
      fold(
        (e) => callApiFailure(e.message),
        (d) => callApiSuccess(`成功更新 ${d.data} 记录`)
      )
    )();

  const handleDeleteCompany: DeleteRecordHandler<CompanyAllFields> = (
    deleteOptions
  ) =>
    pipe(
      callDeleteCompanyApi(deleteOptions),
      fold(
        (e) => callApiFailure(e.message),
        (d) => callApiSuccess(`成功删除 ${d.data} 记录`)
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
        />
      )}
    />
  );
};

export default withPageAuthRequired(CompanyPage);
