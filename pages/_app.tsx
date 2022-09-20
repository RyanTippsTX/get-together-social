import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';
import supabase from '../lib/supabase';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider supabase={supabase}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
