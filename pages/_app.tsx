import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0';
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
