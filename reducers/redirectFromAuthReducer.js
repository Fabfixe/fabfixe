import { REDIRECT_AUTH_PAGES } from '../actions/types'

const initialState = {
  redirectFromAuth: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case REDIRECT_AUTH_PAGES:
    return {
      redirectFromAuth: action.payload
    }

    default:
      return state
  }
}
