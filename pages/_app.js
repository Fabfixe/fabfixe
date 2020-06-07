import React from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from 'next/app'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import setAuthToken from '../setAuthToken'
import jwt_decode from 'jwt-decode'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { setCurrentUser, logoutUser, redirectAuthPages } from '../actions/authentication'
import { getProfile, setProfile } from '../actions/profile'
import '../scss/index.scss'

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
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps }
  }

  componentDidMount() {
    const { store } = this.props

    // Store pathname of first visited page
    sessionStorage.setItem('initialPath', Router.pathname)

    if(process.browser) {
      if(localStorage.jwtToken) {

        setAuthToken(localStorage.jwtToken)
        const decoded = jwt_decode(localStorage.jwtToken)
        store.dispatch(setCurrentUser(decoded))
        const currentTime = Date.now() / 1000
        if(decoded.exp < currentTime) {
          store.dispatch(logoutUser())
          window.location.href = '/account/login'
        }
      } else {
        store.dispatch(redirectAuthPages(true))
      }
    }

    if(store.getState().auth.user._id) {
      getProfile(store.getState().auth.user._id)
        .then((profile) => {
          if(profile) store.dispatch(setProfile(profile))
        })
    }
  }

  render() {
    const { Component, store, pageProps } = this.props
    return (
        <Provider store={ store }>
          <Component { ...pageProps }/>
        </Provider>
    )
  }
}

export default withRedux(makeStore)(Fabfixe)
