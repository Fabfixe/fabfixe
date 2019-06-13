import React, { Component } from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import { connect } from 'react-redux'
import Router from 'next/router'
import axios from 'axios'
import moment from 'moment'
import { getSessions, cancelSession, deleteSession } from '../actions/session'
import { currencyFormatted, calcTotal, timeMap, formatTime } from '../helpers'
import validateSessionSubmit from '../validation/sessionSubmit'
const cn = require('classnames')

class EditSession extends Component {
  constructor(props) {
    super(props)

    this.state = {
      schedulerOpen: false,
      date: this.props.date,
      duration: this.props.duration,
      message: null,
      errors: {},
    }

    this.handleScheduler = this.handleScheduler.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.cancelSession = this.cancelSession.bind(this)
    this.deleteSession = this.deleteSession.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  handleScheduler() {
    this.setState({
      schedulerOpen: !this.state.schedulerOpen,
    })
  }

  onChange(date) {
    this.setState({ date })
  }

  onSubmit() {
    this.setState({ loading: true })
    const newMessage = {
      from: this.props.userId,
      time: new Date(),
      body: this.state.message
    }

    let newSession = {
      _id: this.props._id,
      date: moment(this.state.date),
      duration: this.state.duration,
      description: this.props.description
    }

    // Dont send an empty message
    if(newMessage.body !== null) newSession.messages = this.props.messages.concat(newMessage)
    
    const validation = validateSessionSubmit(newSession)
    if(validation.isValid) {
      axios.post('/api/sessions/update/', newSession)
      .then((res) => {
        // Add check for response code
        this.props.showSubmit(res.data)
        setTimeout(() =>  { this.setState({ loading: false })}, 2000)
      })
      .catch((err) => {
        console.log('err from session update', err)
        this.setState({ loading: false })
      })
    }
  }

  cancelSession() {
    if(window.confirm('Are you sure you want to cancel?')) {
      cancelSession(this.props._id)
      .then((res) => {
        if(res.status === 200) {
          Router.push('/account/my-sessions')
        }
      })
    }
  }

  deleteSession() {
    if(window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(this.props._id, this.props.isPupil)
      .then((res) => {
        console.log('res', res)
        if(res.status === 200) {
          Router.push('/account/my-sessions')
        }
      })
    }
  }

  onTextChange(e) {
    this.setState({
      message: e.target.value
    })
  }

  onSelect(e) {
    e.preventDefault()
    let newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  render() {
    const { artist,
      pupil,
      isPupil,
      date,
      category,
      duration,
      description,
      messages,
      attachment,
      hourlyRate,
      schedulerOpen,
      onChange,
      status } = this.props

    return (
      <div>
        <h1>Manage Session</h1>
        <p>{isPupil ? `Artist: ${artist}` : `Pupil: ${pupil}`}</p>
        <p id="time-display">Time: {formatTime(date, duration)}</p>
        {status === 'pending' &&
        <button className="small-button" onClick={this.handleScheduler}>{this.state.schedulerOpen ? 'Cancel' : 'Request a new time'  }
        </button>}
        {this.state.schedulerOpen && <div className="session-scheduler">
        <h2>CHOOSE TIME</h2>
          <Datetime
            inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
            onChange={this.onChange}
          />
          <h2>SESSION DURATION</h2>
          <select
            onChange={this.onSelect}
            name="duration"
            value={this.state.duration}
          >
            <option value="30 min">{`30 min: $${calcTotal("30 min", hourlyRate)}`}</option>
            <option value="1 hour">{`1 hour: $${calcTotal("1 hour", hourlyRate)}`}</option>
            <option value="1 hour 30 min">{`1 hour 30 min: $${calcTotal("1 hour 30 min", hourlyRate)}`}</option>
            <option value="2 hours">{`2 hours: $${calcTotal("2 hours", hourlyRate)}`}</option>
          </select>
        </div>}
        <p>Category: {category}</p>
        <p>Description: {description}</p>
        {attachment && <div style={{backgroundImage: `url(${attachment})`,
          width: '100px',
          height: '100px',
          backgroundSize: 'cover',
          marginBottom: '20px'
        }} />}
        <p style={{ textTransform: 'capitalize', display: 'inline-block' }}>Status: {status}</p>
        {(status === 'pending' || status === 'upcoming') && <button className="small-button" onClick={this.cancelSession} style={{ marginBottom: '20px'}}>Cancel Session</button>}
        {messages.length > 1 &&
          <div>
            <h2>Messages</h2>
            <div className="modal-messages">
              {messages.map((message, id) => {
                return (
                  <div style={{
                    borderTop: 'dashed black 1px',
                    paddingTop: '10px' }} key={id}>
                    <p>Sent: {moment(message.time).format("MM/DD/YYYY h:mma")}</p>
                    <p>From: {message.from === this.props.userId ? 'You' : isPupil ? artist : pupil }</p>
                    <p>{message.body}</p>
                  </div>
                )})}
            </div>
          </div>
        }
        {status != 'cancelled' &&
          <React.Fragment>
            <h2>Add a Message</h2>
            <textarea onChange={this.onTextChange} style={{ marginBottom: '30px' }} maxLength="250"/>
          </React.Fragment>
        }
        {status === 'pending' && <Button onClick={this.onSubmit}>{this.state.loading ? 'Loading' : 'Send Update'}</Button>}
        {status === 'cancelled' && <Button onClick={this.deleteSession}>Delete Session</Button>}
      </div>
    )
  }
}

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
    console.log('mounted')
    const { _id, accountType } = this.props.user

    getSessions(_id, accountType)
    .then((res) => {
      const validSessions = res.data.filter(session => !session[this.state.user.accountType + 'Deleted'] && session.artist !== null)
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
        return session
      }
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
