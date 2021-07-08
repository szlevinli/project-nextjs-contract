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
import { CRUDComponentProps, fold } from '../lib/utils/componentHelper';
import { ACTION } from '../lib/utils/const';
import {
  validateAbbr,
  validateName,
} from '../lib/validations/companyValidation';
import InputText from './InputText';

export type CRUDFormDialogProps<AllFields, BusinessFields> = {
  open: boolean;
  handleClose: () => void;
  componentProps: CRUDComponentProps<AllFields, BusinessFields>;
};

export const FormDialog = ({
  open,
  handleClose,
  componentProps,
}: CRUDFormDialogProps<CompanyAllFields, CompanyCreateFields>) => (
  <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
    <DialogTitle>Dialog Title</DialogTitle>
    <DialogContent>
      <DialogContentText>Dialog Content Text</DialogContentText>
      <Company {...componentProps} />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

const Company = (
  props: CRUDComponentProps<CompanyAllFields, CompanyCreateFields>
) => {
  const { name: originalName, abbr: originalAbbr } = fold(
    props,
    () => ({ name: '', abbr: '' }),
    (data) => data,
    (data) => data
  );

  const [name, setName] = useState(originalName);
  const [nameError, setNameError] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const [abbr, setAbbr] = useState(originalAbbr);
  const [abbrError, setAbbrError] = useState(false);
  const [abbrTouched, setAbbrTouched] = useState(false);

  const handleSubmit = fold(
    props,
    (create) => () => create({ name, abbr }),
    (d, del) => () => del({ where: { id: d.id } }),
    (d, update) => () => update({ name, abbr }, { where: { id: d.id } })
  );

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    handleSubmit();
  };

  const isLegal = () => !nameError && !abbrError;

  const isTouched = () => nameTouched && abbrTouched;

  const isDirty = () => originalName === name && originalAbbr === abbr;

  const canSubmit = fold(
    props,
    () => () => isTouched() && isLegal(),
    () => () => !isDirty() && isLegal(),
    () => () => !isDirty() && isLegal()
  );

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
        {props.type === ACTION.CREATE ? '创建' : '修改'}-
        {fold(
          props,
          () => '创建',
          () => '删除',
          () => '更新'
        )}
      </Button>
    </>
  );
};

export default Company;
