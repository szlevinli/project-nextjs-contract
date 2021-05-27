const withHandler =
  <Data, Props>(handlerName: string) =>
  (handler: (data: Data) => Promise<unknown>) =>
  (Component: React.FC<Props>) =>
  (props: Props) =>
    <Component {...props} {...{ [handlerName]: handler }} />;

export default withHandler;
