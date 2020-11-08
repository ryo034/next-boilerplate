/* eslint-disable react/jsx-props-no-spreading */
import '@/styles/globals.scss';
import { AppProps } from 'next/app';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
