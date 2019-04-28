import { ADD_SESSION } from './types'

export const addSession = (session) => (dispatch) => {
  dispatch({
    type: ADD_SESSION,
    payload: session
  })
}
