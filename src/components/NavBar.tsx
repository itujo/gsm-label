/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import api from '../services/api';

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

let accessLevel = 0;

let NAV_ITEMS: Array<NavItem> = [
  {
    label: '',
  },
];

const REMAKE_ITEMS: Array<NavItem> = [
  {
    label: 'remake',
    children: [
      {
        label: 'entel',
        subLabel: 'remake etiqueta entel',
        href: '/label/entel',
      },
    ],
  },
];

const IMP_ITEMS: Array<NavItem> = [
  {
    label: 'usuarios',
    children: [
      {
        label: 'cadastrar',
        subLabel: 'cadastrar novo usuario',
        href: '/register',
      },
    ],
  },
  {
    label: 'remake',
    children: [
      {
        label: 'entel',
        subLabel: 'remake etiqueta entel',
        href: '/label/entel',
      },
    ],
  },
  {
    label: 'importacao',
    children: [
      {
        label: 'lote',
        subLabel: 'importar lote',
        href: '/upload/batch',
      },
    ],
  },
];

const ADMIN_ITEMS: Array<NavItem> = [
  {
    label: 'usuarios',
    children: [
      {
        label: 'cadastrar',
        subLabel: 'cadastrar novo usuario',
        href: '/register',
      },
    ],
  },
  {
    label: 'remake',
    children: [
      {
        label: 'entel',
        subLabel: 'remake etiqueta entel',
        href: '/label/entel',
      },
    ],
  },
  {
    label: 'importacao',
    children: [
      {
        label: 'lote',
        subLabel: 'importar lote',
        href: '/upload/batch',
      },
    ],
  },
  {
    label: 'admin',
    children: [
      {
        label: 'lote',
        subLabel: 'importar lote',
        href: '/upload/batch',
      },
    ],
  },
];

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => (
  <NextLink href={href as string}>
    <Link
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue('gray.50', 'gray.900') }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: 'gray.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="gray.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  </NextLink>
);
const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverContentBgColor}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};
const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const MobileNav = () => (
  <Stack
    bg={useColorModeValue('white', 'gray.800')}
    p={4}
    display={{ md: 'none' }}
  >
    {NAV_ITEMS.map((navItem) => (
      <MobileNavItem key={navItem.label} {...navItem} />
    ))}
  </Stack>
);

interface UserData {
  name: string;
  username: string;
  accessLevel: number;
}

export default function NavBar(): JSX.Element {
  const [userData, setUserData] = useState<UserData>();

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
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.response);
      });
  }, []);

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
            {userData?.name}
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
