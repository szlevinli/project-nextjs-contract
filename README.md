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
