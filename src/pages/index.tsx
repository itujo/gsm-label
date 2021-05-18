import { Center, Heading } from '@chakra-ui/react';
import Head from 'next/head';

export const Index = (): JSX.Element => (
  <>
    <Head>
      <title key="pageTitle">Index</title>
    </Head>
    <Center h="100vh">
      <Heading>Index page</Heading>
    </Center>
  </>
);

export default Index;
