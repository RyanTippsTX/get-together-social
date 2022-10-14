import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLoadingProvider } from '../lib/appLoading';
import { AuthProvider } from '../lib/auth';
import { ProfileProvider } from '../lib/profile';
import { GuestAuthProvider } from '../lib/guestAuth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLoadingProvider>
      <AuthProvider>
        <ProfileProvider>
          <GuestAuthProvider>
            <Component {...pageProps} />
          </GuestAuthProvider>
        </ProfileProvider>
      </AuthProvider>
    </AppLoadingProvider>
  );
}

export default MyApp;
