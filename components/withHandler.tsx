const withHandler =
  (handlerName: string) =>
  (handler: (data: unknown) => void) =>
  (Component: React.FC<Record<string, unknown>>) =>
  (props: Record<string, unknown>) =>
    <Component {...props} {...{ [handlerName]: handler }} />;

export default withHandler;
