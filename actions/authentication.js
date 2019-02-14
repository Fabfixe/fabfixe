import axios from 'axios'
import { GET_ERRORS } from './types'

export const registerUser = (user) => dispatch => {
  console.log('ok')

  axios.post('/api/users/register', user)
  .then((res) => {
    console.log(res)
  })
  .catch(err => {
    console.log('err', err.response.data)
     dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  })
}

export const loginUser = (user) => dispatch => {
  axios.post('/api/users/login', user)
  .then(res => {
    console.log(res.data)
  })
  .catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  })
}
