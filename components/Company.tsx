import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { ChangeEvent, MouseEventHandler, useState } from 'react';
import { CompanyCreationFields, CompanyFields } from '../lib/sqlite/models';
import {
  validateAbbr,
  validateName,
} from '../lib/validations/companyValidation';
import { validateInputText } from '../lib/validations/validations';
import { ACTION } from '../lib/utils/const';

// TODO: 还未考虑清楚如下点
// - 是否需要父组件传入 action 状态 (add, modify, delete)
// - 如何处理 Dialog 组件和 Company 组件间的关系
export type FormDialogProp = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (args?: CompanyCreationFields) => void;
  data?: CompanyFields;
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
  data?: CompanyFields;
  action?: ACTION;
  handleSubmit: (company: CompanyCreationFields) => unknown;
};

const Company = ({
  data,
  action = ACTION.CREATE,
  handleSubmit,
}: CompanyProps) => {
  const [name, setName] = useState(data?.name || '');
  const [nameError, setNameError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  const [abbr, setAbbr] = useState(data?.abbr || '');
  const [abbrError, setAbbrError] = useState(false);
  const [abbrHelperText, setAbbrHelperText] = useState('');
  const [abbrTouched, setAbbrTouched] = useState(false);

  const onLeftOfName = (e: string) => {
    setNameError(true);
    setNameHelperText(e);
  };

  const onRightOfName = () => {
    setNameError(false);
    setNameHelperText('');
  };

  const onLeftOfAbbr = (e: string) => {
    setAbbrError(true);
    setAbbrHelperText(e);
  };

  const onRightOfAbbr = () => {
    setAbbrError(false);
    setAbbrHelperText('');
  };

  const validateInputTextOfName = () =>
    validateInputText(validateName(name))(onLeftOfName)(onRightOfName);
  const validateInputTextOfAbbr = () =>
    validateInputText(validateAbbr(abbr))(onLeftOfAbbr)(onRightOfAbbr);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setName(value);
    validateInputTextOfName();
  };

  const handleAbbrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setAbbr(e.target.value);
    validateInputTextOfAbbr();
  };

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

  const handleNameBlur = () => {
    validateInputTextOfName();
    setNameTouched(true);
  };

  const handleAbbrBlur = () => {
    validateInputTextOfAbbr();
    setAbbrTouched(true);
  };

  return (
    <>
      <Typography gutterBottom>
        <Paper>
          <TextField
            label="Name"
            required
            fullWidth
            error={nameError}
            helperText={nameHelperText}
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
          />
        </Paper>
      </Typography>

      <Typography gutterBottom>
        <Paper>
          <TextField
            label="Abbr"
            required
            fullWidth
            error={abbrError}
            value={abbr}
            helperText={abbrHelperText}
            onChange={handleAbbrChange}
            onBlur={handleAbbrBlur}
          />
        </Paper>
      </Typography>

      <Button
        onClick={handleClick}
        disabled={!(isLegal() && !isDirty() && isTouched())}
      >
        {action === ACTION.CREATE ? '创建' : '修改'}
      </Button>
    </>
  );
};

export default Company;
