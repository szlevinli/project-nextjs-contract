import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/lib/Either';
import * as R from 'ramda';
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
};

export const createInitState = <BusinessFields>(
  fields: Array<
    Pick<KeyFields<BusinessFields>, 'label' | 'key' | 'value' | 'validation'>
  >
): CRUDStoreState<BusinessFields> => ({
  action: ACTION.CREATE,
  isSubmit: false,
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
    }
  | {
      type: 'SET_VALUE';
      fields: BusinessFields;
    }
  | {
      type: 'SET_STATE';
      state: CRUDStoreState<BusinessFields>;
    };

export const fold = <BusinessFields, R>(
  fa: CRUDStoreAction<BusinessFields>,
  onChangeValue: (key: keyof BusinessFields, value: string) => R,
  onSetValue: (fields: BusinessFields) => R,
  onSetState: (state: CRUDStoreState<BusinessFields>) => R
): R => {
  switch (fa.type) {
    case 'CHANGE_VALUE':
      return onChangeValue(fa.key, fa.value);
    case 'SET_VALUE':
      return onSetValue(fa.fields);
    case 'SET_STATE':
      return onSetState(fa.state);
    default:
      break;
  }
};

export const changeValueConstructor = <BusinessFields>(
  key: keyof BusinessFields,
  value: string
): CRUDStoreAction<BusinessFields> => ({
  type: 'CHANGE_VALUE',
  key,
  value,
});

export const setValueConstructor = <BusinessFields>(
  fields: BusinessFields
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_VALUE',
  fields,
});

export const setStateConstructor = <BusinessFields>(
  state: CRUDStoreState<BusinessFields>
): CRUDStoreAction<BusinessFields> => ({
  type: 'SET_STATE',
  state,
});

export const CRUDStoreReducer = <BusinessFields>(
  state: CRUDStoreState<BusinessFields>,
  action: CRUDStoreAction<BusinessFields>
): CRUDStoreState<BusinessFields> =>
  fold(
    action,

    // type: CHANGE_VALUE
    (key, value) => {
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
      // 缓存当前的 `value` 值
      const prevValue = R.view(getFieldLens('value'), state);
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
              R.all(
                (d) =>
                  (s.action === ACTION.CREATE ? d.isTouched : d.isDirty) &&
                  !d.isError
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
        R.set(getFieldLens('isDirty'), value !== prevValue),
        isSubmit
      );

      return result;
    },

    // type: SET_VALUE
    (fields) => ({
      ...state,
      entities: state.entities.map((a) => ({
        ...a,
        value: String(fields[a.key]),
      })),
    }),

    // type: SET_STATE
    // (state) => state
    R.identity
  );
