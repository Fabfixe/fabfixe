import { UPDATE_PROFILE } from './types'
import axios from 'axios'

export const updateProfile = (accountType, profile) => {
  axios.post(`/api/profile/${accountType}/`, profile)
    .then(res => console.log('updateProfile'))
    .catch((err) => {
      console.log('err from update profile', err)
    })
}
