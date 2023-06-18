import Layout from '../components/layout';

export default function About() {
  return (
    <Layout>
      <div className="xs:min-h-[45rem] mx-auto flex min-h-[35rem] max-w-lg flex-col  gap-6 pt-10">
        <h1 className=" text-center text-5xl font-bold tracking-tight text-zinc-700 ">{'About'}</h1>
        <h2 className=" text-justify text-xl  tracking-tight text-zinc-700 ">
          {"Hi, I'm Ryan Tipps, developer and creator of "}
          <span className="font-semibold">GetTogether.social</span>, a web application built with
          Next.js, Supabase, & Tailwind. Check out the source code on{' '}
          <a
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            href="https://github.com/RyanTippsTX/get-together-social/tree/dev"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          , or connect with me on{' '}
          <a
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            href="https://www.linkedin.com/in/ryantipps/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          . Then hire me!
        </h2>
      </div>
    </Layout>
  );
}
