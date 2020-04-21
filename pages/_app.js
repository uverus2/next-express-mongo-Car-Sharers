import React, {useState} from 'react';

// Styles
import 'reset-css';
import 'react-widgets/dist/css/react-widgets.css';
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../public/styles/GlobalStyles";
import Theme from "../public/styles/Theme";
import { useRouter } from 'next/router';

import Header from "../componenets/MainLayout/Header";
import Footer from "../componenets/MainLayout/Footer";

const Wrap = styled.div`
  padding:0 0.5rem;
  margin:auto;
`;


MyApp.getInitialProps = async({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  if (ctx.req && ctx.req.session.passport) {
    pageProps.user = ctx.req.session.passport.user;
  }
  return { pageProps };
}

function MyApp({ Component, pageProps, router }) {
  const user = pageProps.user;
    return (
        <Wrap>
          <ThemeProvider theme={Theme}>
          <GlobalStyles/>
          { user && router.pathname !== "/additional-reg" && router.pathname !== "/landing" && <Header userID={user._id} name={user.fullName}/> }
          <Component {...pageProps} />
          { user && router.pathname !== "/additional-reg" && <Footer/> }
          {router.pathname === "/landing" && <Footer/>}
          </ThemeProvider>
        </Wrap>
    )
  }


export default MyApp;