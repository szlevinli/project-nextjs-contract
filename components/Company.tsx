import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { MouseEventHandler, useState } from 'react';
import { CompanyAllFields, CompanyCreateFields } from '../lib/sqlite/models';
import { ACTION } from '../lib/utils/const';
import {
  validateAbbr,
  validateName,
} from '../lib/validations/companyValidation';
import InputText from './InputText';

export type FormDialogProp = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (args?: CompanyCreateFields) => void;
  data?: CompanyAllFields;
  action?: ACTION;
};

export const FormDialog = ({
  open,
  handleClose,
  data,
  handleSubmit,
  action = ACTION.CREATE,
}: FormDialogProp) => (
  <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
    <DialogTitle>Dialog Title</DialogTitle>
    <DialogContent>
      <DialogContentText>Dialog Content Text</DialogContentText>
      <Company data={data} handleSubmit={handleSubmit} action={action} />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export type CompanyProps = {
  data?: CompanyAllFields;
  action?: ACTION;
  handleSubmit: (company: CompanyCreateFields) => unknown;
};

const Company = ({
  data,
  action = ACTION.CREATE,
  handleSubmit,
}: CompanyProps) => {
  const [name, setName] = useState(data?.name || '');
  const [nameError, setNameError] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const [abbr, setAbbr] = useState(data?.abbr || '');
  const [abbrError, setAbbrError] = useState(false);
  const [abbrTouched, setAbbrTouched] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    handleSubmit({
      name,
      abbr,
    });
  };

  const isLegal = () => !nameError && !abbrError;

  const isTouched = () => nameTouched && abbrTouched;

  const isDirty = () => {
    const originName = data?.name || '';
    const originAbbr = data?.abbr || '';
    return originName === name && originAbbr === abbr;
  };

  const canSubmit = () =>
    action === ACTION.CREATE
      ? isTouched() && isLegal()
      : !isDirty() && isLegal();

  return (
    <>
      <InputText
        label="Name"
        value={name}
        isError={nameError}
        validation={validateName}
        handleChange={setName}
        handleTouched={setNameTouched}
        handleIsError={setNameError}
      />

      <InputText
        label="Abbr"
        value={abbr}
        isError={abbrError}
        validation={validateAbbr}
        handleChange={setAbbr}
        handleTouched={setAbbrTouched}
        handleIsError={setAbbrError}
      />

      <Button onClick={handleClick} disabled={!canSubmit()}>
        {action === ACTION.CREATE ? '创建' : '修改'}
      </Button>
    </>
  );
};

export default Company;
