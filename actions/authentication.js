import axios from 'axios'
import { GET_ERRORS, SET_CURRENT_USER, REDIRECT_AUTH_PAGES } from './types'
import setAuthToken from '../setAuthToken'
import jwt_decode from 'jwt-decode'
import Router from 'next/router'

export const registerUser = (user, history) => dispatch => {
  axios.post('/api/users/register', user)
  .then((res) => {
    axios.post('/api/users/login', user)
    .then(res => {
      const { token } = res.data
      localStorage.setItem('jwtToken', token)
      setAuthToken(token)

      const decoded = jwt_decode(token)
      dispatch(setCurrentUser(decoded))
      dispatch(redirectFromAuth(false))
      Router.push(`/account/edit-profile/${user.accountType}`), { shallow: true }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    })
  })
  .catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  })
}

export const loginUser = (user) => dispatch => {
  axios.post('/api/users/login', user)
  .then(res => {
    const { token } = res.data
    localStorage.setItem('jwtToken', token)
    setAuthToken(token)
    const decoded = jwt_decode(token)
    dispatch(setCurrentUser(decoded))
    dispatch(redirectFromAuth(false))
  })
  .catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  })
}

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken')
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}

export const redirectAuthPages = (status) => ({
  type: REDIRECT_AUTH_PAGES,
  payload: status
})
