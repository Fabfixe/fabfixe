import { createStore, compose, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

const devtools = (process.browser && window.__REDUX_DEVTOOLS_EXTENSION__)
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : f => f

const initialState = {}

const makeStore = () => createStore(rootReducer, initialState, compose(devtools, applyMiddleware(thunk)))

export default makeStore
