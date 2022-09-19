import Layout from '../components/layout';
import { siteTitle } from '../components/layout';
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <Layout home>
      <Hero />
    </Layout>
  );
}

function Hero() {
  return (
    <div className="hero xs:h-[40rem] h-[30rem] shrink">
      <div className="hero-content text-center">
        {/* <img src="https://placeimg.com/260/400/arch" className="max-w-sm rounded-lg shadow-2xl" /> */}

        <div className="max-w-lg">
          <h1 className="text-[8rem] font-bold">🥳</h1>
          <h1 className="xs:text-5xl text-4xl font-bold tracking-tight">{siteTitle}</h1>
          <h2 className="xs:text-3xl py-6 text-2xl font-semibold italic tracking-tight">
            Create a sharable landing page <br /> for your next{''}
            <TextShuffle
              phrases={[
                'get-together',
                'Friendsgiving',
                'office party',
                'family reunion',
                'barbeque',
                'open mic night',
                'potluck',
                'holiday party',
              ]}
            />
          </h2>
          {/* <p className="py-6"></p> */}
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}

function TextShuffle({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 1500);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <span key={index} className="relative">
      <span className="relative"> ________________</span>
      <span
        className="animate-drop absolute -inset-1 block font-bold text-fuchsia-600"
        // className="absolute -inset-1 block font-bold text-fuchsia-600"
        // className="absolute -inset-1 block -skew-x-2 -skew-y-2 font-bold text-fuchsia-600"
        aria-hidden="true"
      >
        {phrases[index % phrases.length]}
      </span>
    </span>
  );
}
