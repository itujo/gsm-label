import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import api from '../services/api';
import { ADMIN_ITEMS, IMP_ITEMS, REMAKE_ITEMS } from './NavBar/NavItems';
import { NavItem } from '../@types/NavBar';
import DesktopNav from './NavBar/Desktop/DesktopNav';
import MobileNav from './NavBar/Mobile/MobileNav';

let accessLevel = 0;

// eslint-disable-next-line import/no-mutable-exports
export let NAV_ITEMS: Array<NavItem> = [
  {
    label: '',
  },
];

interface UserData {
  name: string;
  username: string;
  accessLevel: number;
}

export default function NavBar(): JSX.Element {
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  const { token } = parseCookies();

  const handleLogout = async () => {
    destroyCookie(null, 'token');
    router.push('/login');
  };

  useEffect(() => {
    api
      .get('/v1/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserData(res.data.user);
        accessLevel = res.data.user.accessLevel;

        if (accessLevel > 5) {
          NAV_ITEMS = ADMIN_ITEMS;
        } else if (accessLevel > 3) {
          NAV_ITEMS = IMP_ITEMS;
        } else {
          NAV_ITEMS = REMAKE_ITEMS;
        }
        setLoading(false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.response);
      });
  }, [loading]);

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily="heading"
            color={useColorModeValue('gray.800', 'white')}
          >
            <NextLink href="/">SPLog - GSM</NextLink>
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={6}
        >
          <Button as="a" fontSize="sm" fontWeight={400} variant="link" href="#">
            user: {userData?.name}
          </Button>
          <Button
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="orange.300"
            onClick={handleLogout}
            _hover={{
              bg: 'orange.200',
            }}
          >
            sair
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}
