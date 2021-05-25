type ErrProps = {
  error: unknown;
};
const Err: React.FC<ErrProps> = ({ error }) => <div>Error: {error}</div>;

export default Err;
