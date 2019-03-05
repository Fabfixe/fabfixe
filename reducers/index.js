import { combineReducers } from 'redux'
import errorReducer from './errorReducer'
import authReducer from './authReducer'
import profileImageReducer from './profileImageReducer'

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  profileImage: profileImageReducer
})
