import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLoadingProvider } from '../lib/appLoading';
import { AuthProvider } from '../lib/auth';
import { ProfileProvider } from '../lib/profile';
import { EventStateProvider } from '../lib/eventState';
import { GuestAuthProvider } from '../lib/guestAuth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLoadingProvider>
      <AuthProvider>
        <ProfileProvider>
          <EventStateProvider>
            <GuestAuthProvider>
              <Component {...pageProps} />
            </GuestAuthProvider>
          </EventStateProvider>
        </ProfileProvider>
      </AuthProvider>
    </AppLoadingProvider>
  );
}

export default MyApp;
