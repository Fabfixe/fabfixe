import { UPLOAD_PROFILE_IMAGE, DELETE_PROFILE_IMAGE } from './types'

export const profileImageUpload = (images) => (dispatch) => {
  dispatch({
    type: UPLOAD_PROFILE_IMAGE,
    payload: images
  })
}

export const profileImageDelete = (id) => (dispatch) => {
  dispatch({
    type: DELETE_PROFILE_IMAGE,
    payload: id
  })
}
