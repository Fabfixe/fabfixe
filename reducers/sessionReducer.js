import { ADD_SESSION, GET_SESSIONS } from '../actions/types'

const initialState = []

export default function(state = initialState, action) {
  switch(action.type) {
    case ADD_SESSION:
      return state.concat([action.payload])
    case GET_SESSIONS:
      return action.payload
    default:
      return state
  }
}
