import { AuthForm } from '../components/AuthForm';
import Layout from '../components/layout';

export default function Login() {
  return (
    <Layout home>
      {/* <h1 className="text-3xl font-bold">Login or SignUp</h1> */}

      <AuthForm />
    </Layout>
  );
}
