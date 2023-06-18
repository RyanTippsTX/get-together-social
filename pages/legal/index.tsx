import Layout from '../../components/layout';

export default function Legal() {
  return (
    <Layout>
      <div className="xs:min-h-[45rem] mx-auto flex min-h-[35rem] max-w-lg flex-col items-center gap-6 pt-10">
        <h1 className="text-center text-5xl font-bold tracking-tight text-zinc-700 ">{'Legal'}</h1>
        <h2 className="text-justify text-xl  tracking-tight text-zinc-700 ">
          {
            'GetTogether.social is still in development. Our Privacy Policy, Terms of Use, and Cookie Policy are coming soon.'
          }
        </h2>
      </div>
    </Layout>
  );
}
