import { ADD_SESSION } from './types'
import { GET_SESSIONS } from './types'
import axios from 'axios'

export const addSession = (session) => (dispatch) => {
  dispatch({
    type: ADD_SESSION,
    payload: session
  })
}

export const getSessions = (id, accountType) => (dispatch) => {
  axios.post('/api/sessions/byId', { id, accountType })
    .then((res) => {
      dispatch({
        type: GET_SESSIONS,
        payload: res.data
      })
    })
    .catch((err) => {
      // copy over error from auth
    })
}
