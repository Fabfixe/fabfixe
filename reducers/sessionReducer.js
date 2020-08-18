import { SET_SESSION } from '../actions/types'

const initialState = {}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_SESSION:
      return action.payload
    default:
      return state
  }
}
