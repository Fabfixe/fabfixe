import React from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App, { Container } from 'next/app'
import withRedux from 'next-redux-wrapper'
import '../scss/index.scss'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
*/

const initialState = {}

const devtools = (process.browser && window.__REDUX_DEVTOOLS_EXTENSION__)
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : f => f

  const makeStore = () => createStore(rootReducer, initialState, compose(applyMiddleware(thunk), devtools))

class Fabfixe extends App {

  static async getInitialProps({ Component, ctx }) {

    // we can dispatch from here too
    ctx.store.dispatch({ type: 'FOO', payload: 'foo' });

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={ store }>
          <Component { ...pageProps } />
        </Provider>
      </Container>
    )
  }
}

export default withRedux(makeStore)(Fabfixe)
