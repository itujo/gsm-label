import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import theme from '../theme';
import '../styles/print.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const { asPath } = useRouter();

  if (asPath === '/login') {
    return (
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider resetCSS theme={theme}>
      <NavBar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
