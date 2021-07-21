/* eslint-disable no-console */
import { Button, Center, Box, Heading } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import Wrapper from '../../components/Wrapper';
import api from '../../services/api';
import withAuth from '../../utils/withAuth';

export const Batch = (): JSX.Element => {
  const [pFiles, setpFiles] = useState<FileList>();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const handleFileUpload = async (e: {
    preventDefault: () => void;
    target: { files: FileList | null };
  }): Promise<void> => {
    e.preventDefault();

    const { files } = e.target;

    setpFiles(files as FileList);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsSubmiting(true);

    const formData = new FormData();
    const files = pFiles as FileList;

    for (let index = 0; index < files.length; index += 1) {
      const element = files[index];

      formData.append('label', element, element.name);
    }

    const { token } = parseCookies();

    api
      .post(`/v1/upload/batch`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgressValue(progress);
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsSubmiting(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setIsSubmiting(false);
      });
  };
  return isSubmiting ? (
    <>
      <Center h="50vh">
        <Box>
          Importando lote, aguarde ...
          <Box mt={4} maxW={200}>
            <progress id="progressBar" value={progressValue} max="100" />
          </Box>
        </Box>
      </Center>
    </>
  ) : (
    <Wrapper variant="regular">
      <Head>
        <title key="pageTitle">lote</title>
      </Head>

      <Center h="50vh">
        <Box>
          <Heading>selecione um ou mais arquivos</Heading>
          <Box mt={8}>
            <form onSubmit={handleSubmit}>
              <input
                onChange={handleFileUpload}
                type="file"
                multiple
                name="label"
                id="label"
              />
              <Box mt={4}>
                <Button type="submit">importar</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Center>
    </Wrapper>
  );
};

export default Batch;
export const getServerSideProps: GetServerSideProps = withAuth(async () => ({
  props: {},
}));
