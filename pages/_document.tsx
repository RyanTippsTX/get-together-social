import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html
      data-theme="mytheme"
      // data-theme="lemonade"
    >
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
