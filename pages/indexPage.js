import Head from 'next/head';

function IndexPage() {
  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" size="48x48"/>
      </Head>
      <p>Hello world!</p>
    </div>
  )
}

export default IndexPage

