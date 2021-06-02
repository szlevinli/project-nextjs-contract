import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '../lib/ui/theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <UserProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default MyApp;
