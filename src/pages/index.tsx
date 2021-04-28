import {
  Center,
  Select,
  VStack,
  StackDivider,
  Button,
  Input,
  Heading,
} from '@chakra-ui/react';
import Head from 'next/head';

export const Index = (): JSX.Element => (
  <>
    <Head>
      <title key="pageTitle">Printer test</title>
    </Head>
    <Center h="100vh">
      <Heading>Index page</Heading>
    </Center>
  </>
);

export default Index;
