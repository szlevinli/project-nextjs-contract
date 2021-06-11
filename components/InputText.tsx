import { Paper, TextField, Typography } from '@material-ui/core';
import { Either } from 'fp-ts/Either';
import { ChangeEvent, SetStateAction, useState, Dispatch } from 'react';
import { validateInputText } from '../lib/validations/validations';

export type InputTextProps = {
  label: string;
  value: string;
  isError: boolean;
  validation: (str: string) => Either<string, string>;
  handleStateChange?: ({ currentValue: string, isTouched: boolean }) => unknown;
  handleChange: Dispatch<SetStateAction<string>>;
  handleTouched: Dispatch<SetStateAction<boolean>>;
  handleIsError: Dispatch<SetStateAction<boolean>>;
};

const InputText = ({
  label,
  value,
  isError,
  validation,
  handleChange,
  handleTouched,
  handleIsError,
}: InputTextProps) => {
  const [helperText, setHelperText] = useState('');

  const onLeft = (e: string) => {
    handleIsError(true);
    setHelperText(e);
  };

  const onRight = () => {
    handleIsError(false);
    setHelperText('');
  };

  const validateInputText_ = (str: string) =>
    validateInputText(validation(str))(onLeft)(onRight);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    handleChange(value);
    validateInputText_(value);
    handleTouched(true);
  };

  return (
    <Typography gutterBottom>
      <Paper>
        <TextField
          label={label}
          required
          fullWidth
          error={isError}
          helperText={helperText}
          value={value}
          onChange={handleValueChange}
        />
      </Paper>
    </Typography>
  );
};

export default InputText;
