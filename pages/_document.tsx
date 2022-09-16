import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html
      data-theme="mytheme"
      // data-theme="lemonade"
    >
      <Head>
        {/* Tailwind's recommended universal sans font: */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
