import { absurd, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/lib/Either';
import * as R from 'ramda';
import { PkFields } from '../sqlite/models';
import { ACTION } from './const';

export type KeyFields<BusinessFields> = {
  label: string;
  key: keyof BusinessFields;
  value: string;
  validation: (str: string) => E.Either<string, string>;
  isError: boolean;
  helperText: string;
  isTouched: boolean;
  isDirty: boolean;
};

export type CRUDStoreState<BusinessFields> = {
  action: ACTION;
  entities: KeyFields<BusinessFields>[];
  isSubmit: boolean;
  id: PkFields['id'] | null;
  timestamp: number;
};

export const createInitState = <BusinessFields>(
  fields: Array<
    Pick<KeyFields<BusinessFields>, 'label' | 'key' | 'value' | 'validation'>
  >
): CRUDStoreState<BusinessFields> => ({
  action: ACTION.CREATE,
  isSubmit: false,
  id: null,
  timestamp: Date.now(),
  entities: fields.map((v) => ({
    label: v.label,
    key: v.key,
    value: v.value,
    validation: v.validation,
    isError: false,
    helperText: '',
    isTouched: false,
    isDirty: false,
  })),
});

export type CRUDStoreAction<BusinessFields> =
  | {
      type: 'CHANGE_VALUE';
      key: keyof BusinessFields;
      value: string;
      preValue: string;
    }
  | {
      type: 'SET_ENTITY';
      entity: BusinessFields;
    }
  | {
      type: 'SET_STATE';
      state: CRUDStoreState<BusinessFields>;
    }
  | {
      type: 'SET_ACTION';
      action: ACTION;
    }
  | {
      type: 'SET_ID';
      id: PkFields['id'] | null;
    }
  | {
      type: 'SET_TIMESTAMP';
      timestamp: number;
    };

export const fold = <BusinessFields, R>(
  fa: CRUDStoreAction<BusinessFields>,
  onChangeValue: (
    key: keyof BusinessFields,
    value: string,
    preValue: string
  ) => R,
  onSetEntity: (fields: BusinessFields) => R,
  onSetState: (state: CRUDStoreState<BusinessFields>) => R,
  onSetAction: (action: ACTION) => R,
  onSetId: (id: PkFields['id'] | null) => R,
  onSetTimestamp: (timestamp: number) => R
): R => {
  switch (fa.type) {
    case 'CHANGE_VALUE':
      return onChangeValue(fa.key, fa.value, fa.preValue);
    case 'SET_ENTITY':
      return onSetEntity(fa.entity);
    case 'SET_STATE':
      return onSetState(fa.state);
    case 'SET_ACTION':
      return onSetAction(fa.action);
    case 'SET_ID':
      return onSetId(fa.id);
    case 'SET_TIMESTAMP':
      return onSetTimestamp(fa.timestamp);
    default:
      return absurd(fa);
  }
};

export const changeValueConstructor = <BusinessFields>(
  key: keyof BusinessFields,
  value: string,
  preValue: string
): CRUDStoreAction<BusinessFields> => ({
  type: 'CHANGE_VALUE',
  key,
  value,
  preValue,
});

export const setEntityConstructor = <BusinessFields>(
  entity: BusinessFields
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_ENTITY',
  entity,
});

export const setStateConstructor = <BusinessFields>(
  state: CRUDStoreState<BusinessFields>
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_STATE',
  state,
});

export const setActionConstructor = <BusinessFields>(
  action: ACTION
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_ACTION',
  action,
});

export const setIdConstructor = <BusinessFields>(
  id: PkFields['id'] | null
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_ID',
  id,
});

export const setTimestampConstructor = <BusinessFields>(
  timestamp: number
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_TIMESTAMP',
  timestamp,
});

export const CRUDStoreReducer = <BusinessFields>(
  state: CRUDStoreState<BusinessFields>,
  action: CRUDStoreAction<BusinessFields>
): CRUDStoreState<BusinessFields> =>
  fold(
    action,

    // type: CHANGE_VALUE
    (key, value, preValue) => {
      // 受益于 typescript 类型检测, 这里的 `keyIdx` 不会等于 -1
      // 即传入的 `key` 一定存在于 `state.entities` 中
      const keyIdx = state.entities.findIndex((v) => v.key === key);
      // 帮助函数
      // 获取指定的 lens 对象
      const getFieldLens = <K extends keyof KeyFields<BusinessFields>>(
        fieldName: K
      ) =>
        R.lensPath<
          CRUDStoreState<BusinessFields>,
          KeyFields<BusinessFields>[K]
        >(['entities', keyIdx, fieldName]);
      // 缓存当前字段的值校验函数
      const validation = R.view(getFieldLens('validation'), state);
      // `isSubmit` 的 lens 对象
      const isSubmitLens =
        R.lensProp<CRUDStoreState<BusinessFields>>('isSubmit');
      // 设置 `isSubmit`
      // @return: CRUDStoreState<BusinessFields>
      const isSubmit = (s: CRUDStoreState<BusinessFields>) =>
        pipe(
          s,
          R.set(
            isSubmitLens,
            pipe(
              s.entities,
              R.both(
                s.action === ACTION.CREATE
                  ? R.all<KeyFields<BusinessFields>>((d) => d.isTouched)
                  : R.any<KeyFields<BusinessFields>>((d) => d.isDirty),
                R.all<KeyFields<BusinessFields>>((d) => !d.isError)
              )
            )
          )
        );

      const result = pipe(
        value,
        validation,
        E.fold(
          (e) =>
            pipe(
              state,
              R.set(getFieldLens('isError'), true),
              R.set(getFieldLens('helperText'), e)
            ),
          () =>
            pipe(
              state,
              R.set(getFieldLens('isError'), false),
              R.set(getFieldLens('helperText'), '')
            )
        ),
        R.set(getFieldLens('value'), value),
        R.set(getFieldLens('isTouched'), true),
        R.set(getFieldLens('isDirty'), value !== preValue),
        isSubmit
      );

      return result;
    },

    // type: SET_ENTITY
    (fields) => ({
      ...state,
      entities: state.entities.map((a) => ({
        ...a,
        value: String(fields[a.key]),
      })),
    }),

    // type: SET_STATE
    // (state) => state
    R.identity,

    // type: SET_ACTION
    (action) => ({
      ...state,
      action,
    }),

    // type: SET_ID
    (id) => ({
      ...state,
      id,
    }),

    // type: SET_TIMESTAMP
    (timestamp) => ({
      ...state,
      timestamp,
    })
  );
