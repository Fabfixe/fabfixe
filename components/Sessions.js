import React, { Component } from 'react'
import Modal from '../components/Modal'
import EditSession from '../components/EditSession'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { connect } from 'react-redux'
import moment from 'moment'
import { getSessions, cancelSession, deleteSession } from '../actions/session'
import { currencyFormatted, calcTotal, timeMap, formatTime } from '../helpers'
const cn = require('classnames')

class Sessions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sessions: [],
      showModal: false,
      sessionInView: null,
      isLoading: true,
      showSubmit: false
    }

    this.handleModal = this.handleModal.bind(this)
    this.showSubmit = this.showSubmit.bind(this)
  }

  componentDidMount() {
    const { _id, accountType } = this.props.user

    getSessions(_id, accountType)
    .then((res) => {
      const validSessions = res.data.filter(session => !session[this.state.user.accountType + 'Deleted'] && session.artist !== null)

      validSessions.forEach((session) => {
        if(session.status === 'pending' && moment(session.date).isBefore(moment())) session.status = 'expired'
      })

      const sessions = validSessions.map((session) => {
          session['hourlyRate'] = session.artist.hourlyRate
          session.artist = session.artist.username
          session.pupil = session.pupil.username

          return session
      })

      this.setState({ sessions, isLoading: false })
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps !== prevState) {
      return nextProps
    }
  }

  showSubmit(newSession) {
    const updatedSessions = this.state.sessions.map((session) => {
      if(session._id === newSession._id) {
        session = Object.assign(session, newSession)
      }

      return session
    })

    this.setState({ sessions: updatedSessions })
  }

  handleModal(e) {
    e.preventDefault()
    const sessionInView = this.state.sessions.filter((session) => session._id === e.currentTarget.id)[0]
    this.setState({
      showModal: !this.state.showModal,
      sessionInView
    })
  }

  render() {
    const isPupil = this.state.user.accountType === 'pupil'
    console.log(this.state.sessions)
    const expiredSessions = this.state.sessions.filter((session) => {
      if(session) return session.status === 'expired'
    })
    console.log(this.state.sessions)
    const pendingSessions = this.state.sessions.filter((session) => {
      return session.status === 'pending'
    })

    const cancelledSessions = this.state.sessions.filter((session) => {
      return session.status === 'cancelled'
    })

    const upcomingSessions = this.state.sessions.filter((session) => {
      return session.status === 'upcoming'
    })

    const completedSessions = this.state.sessions.filter((session) => {
      return session.status === 'completed'
    })

    return (
      <React.Fragment>
        {this.state.showSubmit && <div>submitted yo</div>}
        <div className={cn("sessions", "center-module")}>
          {this.state.sessions.length <= 0 ? <div>{this.state.isLoading ? 'Loading' : 'No sessions yet'}</div> :
            <React.Fragment>
            {upcomingSessions.length > 0 &&
              <React.Fragment>
                <h2>UPCOMING SESSIONS</h2>
              </React.Fragment>
            }
            {pendingSessions.length > 0 &&
              <React.Fragment>
                <h2>PENDING SESSIONS</h2>
                <ul>
                  {pendingSessions.map((session, id) => {
                    return (
                      <li id={session._id} onClick={this.handleModal} key={id}>
                        <p className="username">{isPupil ? session.artist : session.pupil}</p>
                        <p>{formatTime(session.date, session.duration)}</p>
                      </li>
                    )
                  })}
                </ul>
              </React.Fragment>
            }
            {upcomingSessions.length > 0 &&
              <React.Fragment>
                <h2>Completed Sessions</h2>
              </React.Fragment>
            }
            {cancelledSessions.length > 0 &&
              <React.Fragment>
                <h2>CANCELLED SESSIONS</h2>
                <ul>
                  {cancelledSessions.map((session, id) => {
                    return (
                      <li id={session._id} onClick={this.handleModal} key={id}>
                        <p className="username">{isPupil ? session.artist : session.pupil}</p>
                        <p>{formatTime(session.date, session.duration)}</p>
                      </li>
                    )
                  })}
                </ul>
              </React.Fragment>
            }
            {expiredSessions.length > 0 &&
              <React.Fragment>
                <h2>EXPIRED SESSIONS</h2>
                <ul>
                  {expiredSessions.map((session, id) => {
                    return (
                      <li id={session._id} onClick={this.handleModal} key={id}>
                        <p className="username">{isPupil ? session.artist : session.pupil}</p>
                        <p>{formatTime(session.date, session.duration)}</p>
                      </li>
                    )
                  })}
                </ul>
              </React.Fragment>
            }
            {this.state.showModal &&
              <Modal handleModal={this.handleModal}>
                <EditSession
                  isPupil={isPupil}
                  userId={this.state.user._id}
                  showSubmit={this.showSubmit}
                { ...this.state.sessionInView }/>
              </Modal>}
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    )
  }
}

Sessions.propTypes = {

}

const mapStateToProps = state => ({ user: state.auth.user, profile: state.profile })

export default connect(mapStateToProps, { getSessions })(Sessions)
