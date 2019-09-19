import React, { Component } from 'react'
import Modal from '../components/Modal'
import EditSession from '../components/EditSession'
import ViewSession from '../components/ViewSession'
import MessagesModal from '../components/MessagesModal'
import ConfirmModal from '../components/ConfirmModal'
import CongratsModal from '../components/CongratsModal'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { connect } from 'react-redux'
import moment from 'moment'
import { getSessions, cancelSession, deleteSession } from '../actions/session'
import { currencyFormatted, calcTotal, timeMap, formatTime } from '../helpers'
const cn = require('classnames')
import Button from '../components/Button'

class Sessions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sessions: [],
      showModal: false,
      sessionInView: null,
      isLoading: true,
      showSubmit: false,
      modalType: ''
    }

    this.closeModal = this.closeModal.bind(this)
    this.handleModal = this.handleModal.bind(this)
    this.changeModal = this.changeModal.bind(this)
    this.showSubmit = this.showSubmit.bind(this)
    this.cancelSession = this.cancelSession.bind(this)
  }

  componentDidMount() {
    const { _id, accountType } = this.props.user

    getSessions(_id, accountType)
    .then((res) => {
      const validSessions = res.data.filter(session => !session[this.state.user.accountType + 'Deleted'] && session.artist !== null)

      const sessions = validSessions.map((session) => {
          session['hourlyRate'] = session.artist.hourlyRate
          session.artistId = session.artist._id
          session.pupilId = session.pupil._id
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

  cancelSession(_id) {
    cancelSession({_id})
    .then((res) => {
      if(res.status === 200) {
        Router.push('/account/my-sessions')
      }
    })
  }

  handleModal(id, modalType) {
    const sessionInView = this.state.sessions.find((session) => session._id === id)
    this.setState({
      showModal: true,
      sessionInView,
      modalType
    })
  }

  closeModal() {
    this.setState({ showModal: false })
    Router.push('/account/my-sessions')
  }

  changeModal(modalType) {
    this.setState({ modalType })
  }

  render() {
    const isPupil = this.state.user.accountType === 'pupil'
    const expiredSessions = this.state.sessions.filter((session) => {
      if(session) return session.status === 'expired'
    })

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
                <ul>
                  {upcomingSessions.map((session, id) => {
                    return (
                      <li key={id}>
                        <p className="username">{isPupil ? session.artist : session.pupil}</p>
                        <p>{formatTime(session.date, session.duration)}</p>
                        <button className="small-button" onClick={() => { this.handleModal(session._id, 'view')}}>View</button>
                        <button className="small-button" onClick={() => { this.handleModal(session._id, 'messages')}}>Messages</button>
                      </li>
                    )
                  })}
                </ul>
              </React.Fragment>
            }
            {pendingSessions.length > 0 &&
              <React.Fragment>
                <h2>PENDING SESSIONS</h2>
                <ul>
                  {pendingSessions.map((session, id) => {
                    return (
                      <li key={id}>
                        <p className="username">{isPupil ? session.artist : session.pupil}</p>
                        <p>{formatTime(session.date, session.duration)}</p>
                        <button className="small-button" onClick={() => { this.handleModal(session._id, 'view')}}>View</button>
                        <button className="small-button" onClick={() => { this.handleModal(session._id, 'edit')}}>Edit</button>
                        <button className="small-button" onClick={() => { this.handleModal(session._id, 'messages')}}>Messages</button>
                      </li>
                    )
                  })}
                </ul>
              </React.Fragment>
            }
            {completedSessions.length > 0 &&
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
                      <li onClick={() => {this.handleModal(session._id, 'view')}} key={id}>
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
                      <li onClick={() => {this.handleModal(session._id, 'view')}} key={id}>
                        <p className="username">{isPupil ? session.artist : session.pupil}</p>
                        <p>{formatTime(session.date, session.duration)}</p>
                      </li>
                    )
                  })}
                </ul>
              </React.Fragment>
            }
            {this.state.showModal &&
              <Modal closeModal={this.closeModal}>
                {this.state.modalType === 'edit' && <EditSession
                  isPupil={isPupil}
                  userId={this.state.user._id}
                  changeModal={this.changeModal}
                  showSubmit={this.showSubmit}
                  { ...this.state.sessionInView }/>}
                {this.state.modalType === 'view' && <ViewSession
                  isPupil={isPupil}
                  userId={this.state.user._id}
                  changeModal={this.changeModal}
                  showSubmit={this.showSubmit}
                  { ...this.state.sessionInView }/>}
                {this.state.modalType === 'confirm' && <ConfirmModal
                  copy={"Are you sure you want to cancel this session? You will lose coin if you cancel within eight hours of the session time"}
                  onConfirm={() => { this.cancelSession(this.state.sessionInView._id)}}
                  onCancel={() => {this.changeModal('edit')}}
                />}
                {this.state.modalType === 'messages' && <MessagesModal
                  isPupil={isPupil}
                  userId={this.state.user._id}
                  changeModal={this.changeModal}
                  showSubmit={this.showSubmit}
                  { ...this.state.sessionInView }/>}
                {this.state.modalType === 'congrats' && <CongratsModal
                  isPupil={isPupil}
                  userId={this.state.user._id}
                  changeModal={this.changeModal}
                  showSubmit={this.showSubmit}
                  { ...this.state.sessionInView }/>}
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
