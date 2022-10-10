import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLoadingProvider } from '../lib/appLoading';
import { AuthProvider } from '../lib/auth';
import { ProfileProvider } from '../lib/profile';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLoadingProvider>
      <AuthProvider>
        <ProfileProvider>
          <Component {...pageProps} />
        </ProfileProvider>
      </AuthProvider>
    </AppLoadingProvider>
  );
}

export default MyApp;
