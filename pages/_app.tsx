import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default MyApp;
