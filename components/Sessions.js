import React, { Component } from 'react'
import Button from '../components/Button'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import axios from 'axios'
import { getSessions } from '../actions/session'
import moment from 'moment'
const formatTime = (time, duration) => {
  if(moment(time).isMoment) return `${time.format("MM/DD/YYYY h:mma")} - ${time.add(timeMap[duration], 'm').format("MM/DD/YYYY h:mma")}`
  return `${moment(time).format("MM/DD/YYYY h:mma")} - ${moment(time).add(timeMap[duration], 'm').format("MM/DD/YYYY h:mma")}`
}

const timeMap = {
  '30 min': 30,
  '1 hour': 60,
  '1 hour 30 min': 90,
  '2 hours': 120
}

class Sessions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sessions: this.props.sessions
    }
  }

  componentDidMount() {
    const { id, accountType } = this.props.user
    this.props.getSessions(id, accountType)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps !== prevState) {
      return nextProps
    }
  }

  render() {
    const pendingSessions = this.state.sessions.filter((session) => {
      return session.status === 'pending'
    })

    return (
      <React.Fragment>
        <h2>UPCOMING SESSIONS</h2>
        {pendingSessions.length > 0 &&
          <React.Fragment>
            <h2>PENDING SESSIONS</h2>
            {pendingSessions.map((session, id) => {
              return (
                <React.Fragment>
                  <p key={id}>{session.artist}</p>
                  <p>{formatTime(session.date, session.duration)}</p>
                </React.Fragment>
              )
          })}
          </React.Fragment>
        }
        <h2>COMPLETED SESSIONS</h2>
        <h2>CANCELLED SESSIONS</h2>
      </React.Fragment>
    )
  }
}

Sessions.propTypes = {

}

const mapStateToProps = state => ({ user: state.auth.user, sessions: state.sessions })

export default connect(mapStateToProps, { getSessions })(Sessions)
