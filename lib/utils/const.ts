const PREFIX = '/api';
const AUTH_PREFIX = `${PREFIX}/auth`;

export const ApiKeys = {
  AUTH_LOGIN: `${AUTH_PREFIX}/login`,
  AUTH_CALLBACK: `${AUTH_PREFIX}/callback`,
  AUTH_LOGOUT: `${AUTH_PREFIX}/logout`,
  AUTH_ME: `${AUTH_PREFIX}/me`,

  COMPANY_CREATE: `${PREFIX}/addCompany`,
  COMPANY_READ: `${PREFIX}/getCompanies`,
  COMPANY_UPDATE: `${PREFIX}/updateCompany`,
  COMPANY_DELETE: `${PREFIX}/delAllCompanies`,
};

export enum ACTION {
  CREATE,
  MODIFY,
  DELETE,
}
