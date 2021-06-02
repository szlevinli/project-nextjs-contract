import axios from 'axios';
import { tryCatch } from 'fp-ts/TaskEither';

export const callApi =
  <Body, T>(url: string) =>
  (body?: Body) =>
    tryCatch(
      () => axios.post<T>(url, body),
      (err) => new Error(String(err))
    );
