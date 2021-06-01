type ErrProps = {
  error: unknown;
};
const Err: React.FC<ErrProps> = ({ error }) => (
  <div>Error: {String(error)}</div>
);

export default Err;
