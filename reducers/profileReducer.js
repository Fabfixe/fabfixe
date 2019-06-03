import { SET_PROFILE } from '../actions/types'

const initialState = {
  username: '',
  profileImageUrl: '',
  youtube: '',
  instagram: '',
  twitter: '',
  facebook: '',
  hourlyRate: 0,
  expertise: { makeup: [], hair: []},
  sessions: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_PROFILE:
      return {
        ...state,
        username: action.payload.username,
        profileImageUrl: action.payload.profileImageUrl,
        youtube: action.payload.youtube,
        instagram: action.payload.instagram,
        twitter: action.payload.twitter,
        facebook: action.payload.facebook,
        hourlyRate: action.payload.hourlyRate,
        expertise: action.payload.expertise,
        sessions: action.payload.sessions
      }

    default:
      return state
  }
}
