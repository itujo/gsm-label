/* eslint-disable no-console */
import { Box, Button, Heading, Center, Select } from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import socketClient, { Socket } from 'socket.io-client';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import api from '../../services/api';
import mmToInches from '../../utils/mmToInches';

const Entel = (): JSX.Element => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [printerNames, setPrinterNames] = useState(['']);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [io, setIo] = useState<Socket | null>(null);
  const [zpl, setZpl] = useState('');

  useEffect(() => {
    const socket = socketClient('localhost:7837');
    socket.on('connection', () => {
      console.log(`I'm connected with the back-end`);
    });

    if (!socket) return;
    socket.emit('listPrinters');
    socket.on('printerList', (printers) => {
      setPrinterNames(printers);
    });
    setIo(socket);
  }, []);

  const handleLabelary = async (zplString: string) => {
    const { data } = await axios.get(
      `https://api.labelary.com/v1/printers/8dpmm/labels/${mmToInches(
        50
      )}x${mmToInches(25)}/0/${zplString}`,
      { responseType: 'blob' }
    );

    const zplField = document.getElementById('printArea') as HTMLImageElement;
    zplField.hidden = false;
    zplField.src = URL.createObjectURL(data);
  };

  const handlePrint = async () => {
    if (!selectedPrinter || !zpl) return; // TODO: handle validation

    io?.emit('zplToPrint', selectedPrinter, zpl);

    io?.on('printSuccess', () => {
      console.log('success');
    });

    io?.on('printError', () => {
      console.error('error');
    });
  };

  return (
    <div>
      <Wrapper variant="small">
        <Head>
          <title>entel - remake</title>
        </Head>
        <Center mb={4}>
          <Heading>Entel - Remake</Heading>
        </Center>

        <Center>
          <Box
            p={10}
            maxWidth="800px"
            borderWidth={1}
            borderRadius={8}
            boxShadow="lg"
          >
            <Select mb={2} onChange={(e) => setSelectedPrinter(e.target.value)}>
              <option value="null">Selecione uma impressora</option>
              {printerNames.map((printer) => (
                <option value={printer} key={printer}>
                  {printer}
                </option>
              ))}
            </Select>

            <Formik
              initialValues={{ iccidOrImsi: '' }}
              onSubmit={async (values, { setErrors, resetForm }) => {
                const { iccidOrImsi } = values;
                setSubmitting(true);

                api
                  .post('/v1/label/generate', { iccidOrImsi })
                  .then(async (res) => {
                    setZpl(res.data);

                    await handleLabelary(res.data);

                    setSubmitting(false);
                  })
                  .catch((error) => {
                    if (error.response) {
                      if (error.response.status === 404) {
                        setErrors({ iccidOrImsi: 'not found' });
                        setTimeout(() => {
                          resetForm();
                          setSubmitting(false);
                        }, 1000);
                      }
                    }
                  });
              }}
            >
              {() => (
                <Form>
                  <InputField
                    name="iccidOrImsi"
                    placeholder="iccid ou imsi"
                    label="iccid ou imsi"
                    width={400}
                  />

                  <Button mt={4} isLoading={isSubmitting} type="submit">
                    enviar
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Center>
        <Box mt={10}>
          <img
            hidden
            title="printArea"
            src=""
            id="printArea"
            alt="label"
            className="printArea"
          />
        </Box>
        <Button onClick={handlePrint}>print</Button>
      </Wrapper>
    </div>
  );
};

export default Entel;
