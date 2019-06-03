import { SET_PROFILE, UPDATE_PROFILE } from './types'
import axios from 'axios'

export const updateProfile = (accountType, profile) => {
  return axios.post(`/api/profile/${accountType}/`, profile)
}

export const getProfile = (_id) => {
   return axios.post('/api/profile/', { _id })
    .then(res => res.data)
    .catch((err) => {
      console.log('err from getProfile', err)
    })
}

export const setProfile = (profile) => {
  return {
    type: SET_PROFILE,
    payload: profile
  }
}
