import { Button } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';
import CRUDComponent from '../components/CRUDComponent';
import FormDialog from '../components/CRUDFormDialog';
import { CompanyAllFields, CompanyCreateFields } from '../lib/sqlite/models';
import {
  create as handler4Create,
  CreateRecordHandler,
  CRUDHandler,
  DeleteRecordHandler,
  modify as handler4Modify,
  UpdateRecordHandler,
} from '../lib/utils/componentHelper';
import { ACTION } from '../lib/utils/const';
import {
  createInitState,
  CRUDStoreAction,
  CRUDStoreReducer,
  CRUDStoreState,
  setActionConstructor,
  setEntityConstructor,
  setStateConstructor,
  setTimestampConstructor,
} from '../lib/utils/state';
import {
  validateAbbr,
  validateName,
} from '../lib/validations/companyValidation';

export type CompaniesProps = {
  data: CompanyAllFields[];
  handleAddCompany: CreateRecordHandler<CompanyCreateFields>;
  handleUpdateCompany: UpdateRecordHandler<
    CompanyAllFields,
    CompanyCreateFields
  >;
  handleDeleteCompany: DeleteRecordHandler<CompanyAllFields>;
};

const Companies: React.FC<CompaniesProps> = ({
  data,
  handleAddCompany,
  handleUpdateCompany,
  handleDeleteCompany,
}) => {
  const initState = createInitState<CompanyCreateFields>([
    {
      label: '名称',
      key: 'name',
      value: '',
      validation: validateName,
    },
    {
      label: '简称',
      key: 'abbr',
      value: '',
      validation: validateAbbr,
    },
  ]);
  const [open, setOpen] = React.useState(false);
  const [handler, setHandler] = React.useState<
    CRUDHandler<CompanyAllFields, CompanyCreateFields>
  >(handler4Create(handleAddCompany));
  const [state, dispatch] = React.useReducer<
    React.Reducer<
      CRUDStoreState<CompanyCreateFields>,
      CRUDStoreAction<CompanyCreateFields>
    >
  >(CRUDStoreReducer, initState);

  const handleClose = () => {
    setOpen(false);
  };

  const create = () => {
    dispatch(setStateConstructor(initState));
    dispatch(setActionConstructor(ACTION.CREATE));
    dispatch(setTimestampConstructor(Date.now()));
    setHandler(handler4Create(handleAddCompany));
    setOpen(true);
  };

  const modify = (id: number) => {
    const value = R.find<CompanyAllFields>(R.propEq('id', id))(data);
    const businessFields = R.pick(['name', 'abbr'], value);
    dispatch(setStateConstructor(initState));
    dispatch(setActionConstructor(ACTION.MODIFY));
    dispatch(setTimestampConstructor(Date.now()));
    dispatch(setEntityConstructor(businessFields));
    setHandler(handler4Modify(value, handleUpdateCompany));
    setOpen(true);
  };

  return (
    <div>
      <h1>Company</h1>
      <Button onClick={create}>New</Button>
      <ul>
        {data.map((v) => (
          <li key={v.id}>
            {v.id}: {JSON.stringify(v)}
            <Button onClick={() => modify(v.id)}>Modify</Button>
            <Button
              onClick={() => handleDeleteCompany({ where: { id: v.id } })}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <FormDialog
        open={open}
        handleClose={handleClose}
        handler={handler}
        state={state}
        dispatch={dispatch}
        CRUDComponent={CRUDComponent}
      />
    </div>
  );
};

export default Companies;
