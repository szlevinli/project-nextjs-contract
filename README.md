# Project with Next.js

## Fetch Data from Remote

### Lift `useSWR` to `Either`

文件路径: <projectRoot>/lib/utils/fetchJsonWithSwr.ts

目的:

- 将执行 `useSWR` 后的结果封装到 `Either` 中
- 使用 `io-ts`, `io-ts-reporters` 包对服务器返回的数据进行 **运行时** 静态类型检测

> 注意: 在 `Either` 的 `left` 中实际包含两种应用程序状态, 一个是执行 `useSWR` 时发生的错误, 一个是正在 loading 状态. 这要求在进行 `onLeft` 操作时需要对回调函数中传入的参数进行判断, i.e. `(e) => (isNil(e) ? loading() : error(e))`

### 分析远程返回的数据 (已被封装到 `Either`)

文件路径: <projectRoot>/components/Remote.tsx

目的:

- 分析从远程服务器返回的被封装到 `Either` 中的数据
- 发生错误则调用错误界面
- 加载状态下调用加载界面
- 成功读取到数据则调用使用该数据去显示的界面

### 组装上面两个功能

文件路径: <projectRoot>/components/Fetchable.tsx

目的:

- 调用 `useFetchJsonWithSwr`
- 调用 `Remote` 组件

## 数据验证

对数据的合法性验证分为两类

- 类型验证
- 数值验证

### 类型验证

这种验证方式解决的问题是, 当通过 API 方式进行数据传递时, 我们需要验证收到的数据符合某些类型要求, 比如: 在创建 Company 时, 在服务器端收到客户端通过 HTTP 传来的数据, 我们需要验证收到的数据符合 Company 类型要求, 即需要有 name 字段, 且该字段是 string; 或者在客户通我们通过 HTTP RestFul 获取的数据中, 我们需要验证其 createdAt 字段符合 DateIOS 格式.

在本项目中, 我们采用 `io-ts` 包来进行类型验证, 更准确的来说是运行时类型验证, 具体可参考其 [API 文档](https://github.com/gcanti/io-ts/blob/HEAD/index.md)

### 数值验证

这是最常见的验证, 比如: 验证 Company 中 name 字段的长度, 是否包含字符等.

在本项目中, 我们采用 `fp-ts` 包的 `Validation` 概念来处理此类验证.

## 错误控制

在 HTTP RestFul 请求中, `fetch` 或 `axios` 这些工具包均会对 HTTP Response state code 为非 `2xx` 的码值当做错误处理, 通常都会进行 `Promise.reject` 处理. 但在实际工作中, 后台检测到的一些错误需要通知客户端知晓, 此时我们可以将 HTTP Response state code 的码值设置为一个以 2 开头的数字, 只要不要和目前 HTTP 预留的码值冲突即可, 比如 `290`.

截止我们需要在接收端对 `290` 进行处理, 告知接收端后续代码发生了什么错误.

在本项目中我们采用 `TaskEither` 来处理, 具体详见 <projectRoot>/lib/utils/helper.ts

```typescript
import axios, { AxiosResponse } from 'axios';
import { tryCatch, chain, fromPredicate } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

export const callApi =
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
```
