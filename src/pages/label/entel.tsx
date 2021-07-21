/* eslint-disable no-console */
import {
  Box,
  Button,
  Heading,
  Center,
  Select,
  ButtonGroup,
  Alert,
  AlertIcon,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik, FormikProps } from 'formik';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { Ref, useEffect, useRef, useState } from 'react';
import socketClient, { Socket } from 'socket.io-client';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import api from '../../services/api';
import mmToInches from '../../utils/mmToInches';

const Entel = (): JSX.Element => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [printerNames, setPrinterNames] = useState(['']);
  const [selectedPrinter, setSelectedPrinter] = useState<string | undefined>(
    undefined
  );
  const [io, setIo] = useState<Socket | null>(null);
  const [zpl, setZpl] = useState('');
  const [printSuccess, setPrintSuccess] = useState(false);
  const [printerError, setPrinterError] = useState(false);
  const [iccidId, setIccidId] = useState<number | null>(null);
  const formikRef = useRef<{ resetForm(): void }>();

  const [verticalAlign, setVerticalAlign] = useState('');
  const [horizontalAlign, setHorizontalAlign] = useState('');
  const [darkness, setDarkness] = useState('');

  useEffect(() => {
    const socket = socketClient('http://localhost:7837');
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
    setPrintSuccess(false);
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
    if (!selectedPrinter || !zpl || !iccidId) {
      setPrinterError(true);
    } // TODO: handle validation

    io?.emit('zplToPrint', selectedPrinter, zpl, iccidId);

    io?.on('printSuccess', async () => {
      const { token } = parseCookies();

      await api.patch(
        '/v1/iccid/update',
        {
          iccid: { id: iccidId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrintSuccess(true);
    });

    io?.on('printError', () => {
      console.error('error');
    });
  };

  const clearForm = () => {
    formikRef.current?.resetForm();
    const zplField = document.getElementById('printArea') as HTMLImageElement;
    zplField.hidden = true;
    setPrintSuccess(false);
  };

  return (
    <div>
      <Alert status="success" hidden={!printSuccess}>
        <AlertIcon />
        impressao bem sucedida
      </Alert>

      <Alert status="error" hidden={!printerError}>
        <AlertIcon />
        certifique-se de selecionar uma impressora
      </Alert>

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
            <Select
              mb={2}
              required
              onChange={(e) => {
                setPrinterError(false);
                setSelectedPrinter(e.target.value);
              }}
              placeholder="selecione uma impressora"
            >
              {printerNames.map((printer) => (
                <option value={printer} key={printer}>
                  {printer}
                </option>
              ))}
            </Select>

            <Formik
              initialValues={{
                iccidOrImsi: '',
                horizontalAlign,
                verticalAlign,
                darkness,
              }}
              innerRef={
                formikRef as
                  | Ref<
                      FormikProps<{
                        iccidOrImsi: string;
                        horizontalAlign: string;
                        verticalAlign: string;
                        darkness: string;
                      }>
                    >
                  | undefined
              }
              onSubmit={async (values, { setErrors }) => {
                setSubmitting(true);

                api
                  .post('/v1/label/generate', {
                    ...values,
                    horizontalAlign,
                    verticalAlign,
                    darkness,
                  })
                  .then(async (res) => {
                    setIccidId(res.data.iccid.id);

                    setZpl(res.data.zpl);

                    await handleLabelary(res.data.rawZpl);

                    setSubmitting(false);
                  })
                  .catch((error) => {
                    if (error.response) {
                      if (error.response.status === 404) {
                        setErrors({ iccidOrImsi: 'not found' });
                        setTimeout(() => {
                          setSubmitting(false);
                          clearForm();
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
                    required
                  />
                  <HStack mt={2}>
                    <InputField
                      type="number"
                      name="horizontalAlign"
                      placeholder="pos x (horizontal)"
                      label="pos x (horiz)"
                      required
                      value={horizontalAlign}
                      onChange={(e) => setHorizontalAlign(e.target.value)}
                    />
                    <InputField
                      type="number"
                      name="verticalAlign"
                      placeholder="pos y (vertical)"
                      label="pos y (vertical)"
                      required
                      value={verticalAlign}
                      onChange={(e) => setVerticalAlign(e.target.value)}
                    />
                    <InputField
                      type="number"
                      name="darkness"
                      min="-30"
                      max="30"
                      placeholder="temperatura"
                      label="temperatura"
                      required
                      value={darkness}
                      onChange={(e) => setDarkness(e.target.value)}
                    />
                  </HStack>

                  <ButtonGroup mt={4} spacing={60}>
                    <Button isLoading={isSubmitting} type="submit">
                      gerar
                    </Button>
                    <Button onClick={clearForm}>limpar</Button>
                  </ButtonGroup>
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
        <Button onClick={handlePrint}>imprimir</Button>
      </Wrapper>
    </div>
  );
};

export default Entel;
