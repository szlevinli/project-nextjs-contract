import { Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import {
  changeValueConstructor,
  CRUDStoreAction,
  CRUDStoreState,
} from '../lib/utils/state';

export type CRUDComponentProps<BusinessFields> = {
  entities: CRUDStoreState<BusinessFields>['entities'];
  originalEntities: CRUDStoreState<BusinessFields>['entities'];
  dispatch: React.Dispatch<CRUDStoreAction<BusinessFields>>;
};

const CRUDComponent = <BusinessFields,>({
  entities,
  originalEntities,
  dispatch,
}: CRUDComponentProps<BusinessFields>) => (
  <>
    {entities.map((v, i) => (
      <Typography component={'span'} gutterBottom key={String(v.key)}>
        <Paper>
          <TextField
            label={v.label}
            required
            fullWidth
            error={v.isError}
            helperText={v.helperText}
            value={v.value}
            onChange={(e) => {
              dispatch(
                changeValueConstructor(
                  v.key,
                  e.target.value,
                  originalEntities[i].value
                )
              );
              e.preventDefault();
            }}
          />
        </Paper>
      </Typography>
    ))}
  </>
);

export default CRUDComponent;
