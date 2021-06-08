import axios, { AxiosResponse } from 'axios';
import { tryCatch, chain, fromPredicate } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

export const callAPI =
  <Body, T>(url: string) =>
  (body?: Body) =>
    pipe(
      tryCatch(
        () => axios.post<T>(url, body),
        (err) => new Error(String(err))
      ),
      // 对于服务器返回的状态码大于等于 290 的当做错误处理
      // 目的是捕捉服务器更详尽的错误
      chain(
        fromPredicate(
          (d: AxiosResponse<T>) => d.status >= 200 && d.status < 290,
          (d: AxiosResponse<T>) => new Error(String(d.data))
        )
      )
    );
