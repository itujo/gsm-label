import { Box, Button, Heading, Text, Center } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import api from '../services/api';
import toErrorMap from '../utils/toErrorMap';

const login = (): JSX.Element => {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Head>
        <title>login</title>
      </Head>

      <Center>
        <Heading>SPLog - Impressao</Heading>
      </Center>

      <Center>
        <Box
          p={10}
          maxWidth="800px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Text mb={10} fontSize={25}>
            login
          </Text>

          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setErrors }) => {
              const { username, password } = values;
              setSubmitting(true);

              api
                .post('/v1/user/login', { username, password })
                .then((res) => {
                  const { token } = res.data;

                  setCookie(null, 'token', token, {
                    maxAge: 24 * 60 * 60,
                    path: '/',
                  });

                  router.push('/');
                })
                .catch((error) => {
                  if (error.response) {
                    if (error.response.data) {
                      setErrors(toErrorMap(error.response.data.errors));
                      setSubmitting(false);
                    }
                    if (error.response.status === 401) {
                      setErrors(toErrorMap(error.response.data.errors));
                      setSubmitting(false);
                    }
                  }
                });
            }}
          >
            {() => (
              <Form>
                <InputField
                  name="username"
                  placeholder="usuario"
                  label="usuario"
                  width={400}
                />
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="senha"
                    label="senha"
                    type="password"
                  />
                </Box>

                <Button mt={4} isLoading={isSubmitting} type="submit">
                  login
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Center>
    </Wrapper>
  );
};

export default login;
