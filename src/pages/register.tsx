import { Box, Button, Heading, Text, Center } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import api from '../services/api';
import toErrorMap from '../utils/toErrorMap';
import withAuth from '../utils/withAuth';

const register = (): JSX.Element => {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Head>
        <title>cadastro</title>
      </Head>

      <Center>
        <Heading>SPLog - Cadastro de Usuario</Heading>
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
            cadastro
          </Text>

          <Formik
            initialValues={{ username: '', password: '', name: '' }}
            onSubmit={async (values, { setErrors }) => {
              const { username, password, name } = values;
              setSubmitting(true);

              api
                .post('/v1/user/register', { name, username, password })
                .then((res) => {
                  if (res.data.user) {
                    // TODO better alert
                    // eslint-disable-next-line no-alert
                    alert(
                      `usuario ${res.data.user.username} cadastrado com sucesso`
                    );
                  }
                  setSubmitting(false);
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
                  name="name"
                  placeholder="nome completo"
                  label="nome completo"
                  width={400}
                />
                <Box mt={4}>
                  <InputField
                    name="username"
                    placeholder="usuario"
                    label="usuario"
                    width={400}
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="senha"
                    label="senha"
                    type="password"
                  />
                </Box>
                <Button mt={4} isLoading={isSubmitting} type="submit">
                  cadastrar
                </Button>
                <Button
                  mt={4}
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  voltar
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Center>
    </Wrapper>
  );
};

export default register;
export const getServerSideProps: GetServerSideProps = withAuth(async () => ({
  props: {},
}));
