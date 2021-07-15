import {
  CRUDStoreReducer,
  createInitState,
  changeValueConstructor,
  CRUDStoreState,
  KeyFields,
  setStateConstructor,
  CRUDStoreAction,
} from './state';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import R from 'ramda';

type CreateFields = {
  name: string;
  abbr: string;
};

const initState = createInitState<CreateFields>([
  {
    label: 'Name',
    key: 'name',
    value: '',
    validation: jest.fn().mockReturnValue(E.right('validate name')),
  },
  {
    label: 'Abbreviation',
    key: 'abbr',
    value: '',
    // 传入空字符串则表示验证错误
    validation: jest.fn(
      E.fromPredicate(R.complement(R.isEmpty), () => 'abbr validate error.')
    ),
  },
]);

const getLens =
  (idx: number) =>
  <K extends keyof KeyFields<CreateFields> = keyof KeyFields<CreateFields>>(
    key: K
  ) =>
    R.lensPath<CRUDStoreState<CreateFields>, KeyFields<CreateFields>[K]>([
      'entities',
      idx,
      key,
    ]);

const getLensForName = getLens(0);
const getLensForAbbr = getLens(1);

const isSubmitLens = R.lensProp<CRUDStoreState<CreateFields>, 'isSubmit'>(
  'isSubmit'
);

describe('Test CRUDStoreReducer', () => {
  it('[type: CHANGE_VALUE]: should be set `name`', () => {
    const changeName: CRUDStoreAction<CreateFields> = changeValueConstructor(
      'name',
      'new name'
    );

    const expVal = pipe(
      initState,
      R.set(getLensForName('value'), 'new name'),
      R.set(getLensForName('isDirty'), true),
      R.set(getLensForName('isTouched'), true)
    );

    const result = CRUDStoreReducer<CreateFields>(initState, changeName);

    expect(result).toEqual(expVal);
  });

  it('[type: CHANGE_VALUE]: should be can submit', () => {
    const changeName: CRUDStoreAction<CreateFields> = changeValueConstructor(
      'name',
      'new name'
    );
    const changeAbbr: CRUDStoreAction<CreateFields> = changeValueConstructor(
      'abbr',
      'new abbr'
    );

    const expVal = pipe(
      initState,
      R.set(getLensForName('value'), 'new name'),
      R.set(getLensForName('isDirty'), true),
      R.set(getLensForName('isTouched'), true),
      R.set(getLensForAbbr('value'), 'new abbr'),
      R.set(getLensForAbbr('isDirty'), true),
      R.set(getLensForAbbr('isTouched'), true),
      R.set(isSubmitLens, true)
    );

    const newState = CRUDStoreReducer<CreateFields>(initState, changeName);
    const result = CRUDStoreReducer<CreateFields>(newState, changeAbbr);

    expect(result).toEqual(expVal);
  });

  it('[type: CHANGE_VALUE]: should be return error', () => {
    const changeAbbr: CRUDStoreAction<CreateFields> = changeValueConstructor(
      'abbr',
      ''
    );

    const expVal = pipe(
      initState,
      R.set(getLensForAbbr('value'), ''),
      R.set(getLensForAbbr('isDirty'), false),
      R.set(getLensForAbbr('isTouched'), true),
      R.set(getLensForAbbr('isError'), true),
      R.set(getLensForAbbr('helperText'), 'abbr validate error.')
    );

    const result = CRUDStoreReducer<CreateFields>(initState, changeAbbr);

    expect(result).toEqual(expVal);
  });

  it('[type: SET_STATE]: should be return specified state', () => {
    const newState = pipe(
      initState,
      R.set(getLensForName('value'), 'new name'),
      R.set(getLensForAbbr('value'), 'new abbr')
    );
    const setState = setStateConstructor(newState);

    const result = CRUDStoreReducer<CreateFields>(initState, setState);

    expect(result).toEqual(newState);
  });
});
