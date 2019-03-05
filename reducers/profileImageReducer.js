import { UPLOAD_PROFILE_IMAGE, DELETE_PROFILE_IMAGE } from '../actions/types'

const initialState = {
  profileImage: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_PROFILE_IMAGE:
      return {
        ...state,
        profileImage: action.payload
      }

    case DELETE_PROFILE_IMAGE:
      return {
        ...state,
        profileImage: []
      }

    default:
      return state
  }
}
