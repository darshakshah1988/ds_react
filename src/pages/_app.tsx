import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import GlobalStyle from '../styles/reset';
import theme from '../styles/theme';

import { store, persistor } from '../redux/store';
import { setUser } from '../redux/slices/authSlice';

export default function App(props: any) {
  // App component props
  const { Component, pageProps } = props;
  const { user } = pageProps;
  const Layout = Component.Layout || null;

  useEffect(() => {
    // If there is a property "user" and it's
    // value is not null then we will update our store for
    // the client side pages.
    if (user) {
      store.dispatch(setUser({ user: user }));
    }
  }, [user]);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            {/* ----- By default, any layout, whether admin or normal, will also get a user object. ----- */}
            {Layout ? (
              <Layout user={user ? user : null}>
                {/* ----- Here our page will also get the default user object. And it will only come when the page will use methods like serverSideProps etc. ----- */}
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
