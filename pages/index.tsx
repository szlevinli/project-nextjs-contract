import { useUser } from '@auth0/nextjs-auth0';
import { GetStaticProps } from 'next';
import db from '../lib/sqlite/db';

export default () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
};

export const getStaticProps: GetStaticProps = async () => {
  await db.sync();
  console.log(`All models were synchronized successfully.`);

  return {
    props: {
      createdDb: true,
    },
  };
};
