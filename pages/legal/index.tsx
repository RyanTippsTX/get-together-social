import Layout from '../../components/layout';

export default function Legal() {
  return (
    <Layout>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
        <h1 className="page-title">{'Legal'}</h1>
        <h2 className="text-muted font-sans text-lg font-normal leading-8">
          {
            'GetTogether.social is still in development. Our Privacy Policy, Terms of Use, and Cookie Policy are coming soon.'
          }
        </h2>
      </div>
    </Layout>
  );
}
