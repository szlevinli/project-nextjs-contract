import db from '../lib/sqlite/db';
import { GetStaticProps } from 'next';

export type DbProps = {
  connectDbResult: string;
};

const Db: React.FC<DbProps> = ({ connectDbResult }) => (
  <div>
    <h1>DB</h1>
    Connect Sqlite Result:
    <br />
    <pre>{connectDbResult}</pre>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  let result: string;
  try {
    await db.authenticate();
    result = 'Connect to Sqlite ok.';
  } catch (e) {
    result = `Connect to Sqlite Error: ${e}`;
  }

  return {
    props: {
      connectDbResult: result,
    },
  };
};

export default Db;
