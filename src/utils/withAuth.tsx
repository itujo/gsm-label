import { GetServerSideProps } from 'next';

export default function withAuth(gssp: GetServerSideProps): GetServerSideProps {
  return async (context) => {
    const { req } = context;
    const { token } = req.cookies;

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return gssp(context);
  };
}
