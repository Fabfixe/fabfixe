import { combineReducers } from 'redux'
import errorReducer from './errorReducer'
import authReducer from './authReducer'
import profileReducer from './profileReducer'
import sessionReducer from './sessionReducer'
import redirectFromAuthReducer from './redirectFromAuthReducer'

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  profile: profileReducer,
  sessions: sessionReducer,
  redirectFromAuth: redirectFromAuthReducer
})
