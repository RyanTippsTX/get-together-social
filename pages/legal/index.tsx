import Layout from '../../components/layout';

export default function Legal() {
  return (
    <Layout>
      <div className="xs:min-h-[45rem] mx-2 flex min-h-[35rem] flex-col items-center gap-6">
        <Section
          title="Terms of Use"
          content={"GetTogether.social is in pre-launch. We're working on our Terms of Use."}
        />
        <Section
          title="Privacy Policy"
          content={"GetTogether.social is in pre-launch. We're working on our Privacy Policy."}
        />
        <Section
          title="Cookie Policy"
          content={"GetTogether.social is in pre-launch. We're working on our Cookie Policy."}
        />
        {/* GetTogether.social launched on September X, 2022 */}
      </div>
    </Layout>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h1 className="pt-16 text-center text-5xl font-bold tracking-tight text-zinc-700 ">
        {title}
      </h1>
      <h2 className="text-center text-xl  tracking-tight text-zinc-700 ">{content}</h2>
    </div>
  );
}
