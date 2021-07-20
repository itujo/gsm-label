import { Center, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import withAuth from '../utils/withAuth';

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
export const getServerSideProps: GetServerSideProps = withAuth(async () => ({
  props: {},
}));
