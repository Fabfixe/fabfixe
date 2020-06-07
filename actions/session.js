import { SET_SESSION } from './types'
import axios from 'axios'

export const setSession = (session) => dispatch => {
   dispatch({
    type: SET_SESSION,
    payload: session
  })
}

export const getSessions = (_id, accountType) => {
  return axios.post('/api/sessions/byId', { _id, accountType })
}

export const cancelSession = (_id, isPupil) => {
  return axios.post('/api/sessions/cancel', { _id, isPupil })
}

export const deleteSession = (_id, isPupil) => {
  return axios.post('/api/sessions/delete', { _id, isPupil })
}
