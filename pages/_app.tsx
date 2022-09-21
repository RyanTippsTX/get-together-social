import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';
import { ProfileProvider } from '../lib/profile';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Component {...pageProps} />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default MyApp;
