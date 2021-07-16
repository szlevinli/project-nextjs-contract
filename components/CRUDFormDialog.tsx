import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import { PkFields } from '../lib/sqlite/models';
import { CRUDHandler, fold } from '../lib/utils/componentHelper';
import {
  CRUDStoreAction,
  CRUDStoreState,
  KeyFields,
  setStateConstructor,
} from '../lib/utils/state';
import { CRUDComponentProps } from './CRUDComponent';

export type CRUDFormDialogProps<AllFields, BusinessFields> = {
  open: boolean;
  handleClose: () => void;
  handler: CRUDHandler<AllFields, BusinessFields>;
  state: CRUDStoreState<BusinessFields>;
  dispatch: React.Dispatch<CRUDStoreAction<BusinessFields>>;
  CRUDComponent: (props: CRUDComponentProps<BusinessFields>) => JSX.Element;
};

const CRUDFormDialog = <
  AllFields extends PkFields,
  BusinessFields extends Record<string, unknown>
>({
  open,
  handleClose,
  handler,
  state,
  dispatch,
  CRUDComponent,
}: CRUDFormDialogProps<AllFields, BusinessFields>) => {
  const [originalState, setOriginalState] = React.useState(state);
  React.useEffect(() => {
    setOriginalState(state);
  }, [state.timestamp]);

  const buttonLabel = fold(
    handler,
    () => '创建',
    () => '删除',
    () => '更新'
  );

  const entitiesReduce = <BusinessFields,>(
    acc: BusinessFields,
    val: KeyFields<BusinessFields>
  ) => ({ ...acc, [val.key]: val.value });

  const handleSubmit = fold(
    handler,
    (create) => () =>
      create(state.entities.reduce(entitiesReduce, {}) as BusinessFields),
    (d, del) => () => del({ where: { id: d.id } }),
    (d, update) => () =>
      update(
        state.entities
          .filter((v) => v.isDirty)
          .reduce(entitiesReduce, {}) as Partial<BusinessFields>,
        { where: { id: d.id } }
      )
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogContent>
        <DialogContentText>Dialog Content Text</DialogContentText>
        <CRUDComponent
          entities={state.entities}
          dispatch={dispatch}
          originalEntities={originalState.entities}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!state.isSubmit}
          onClick={() => {
            handleSubmit();
            handleClose();
          }}
        >
          {buttonLabel}
        </Button>
        <Button onClick={() => dispatch(setStateConstructor(originalState))}>
          Reset
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CRUDFormDialog;
