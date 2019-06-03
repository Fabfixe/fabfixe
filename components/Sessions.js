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
      errors: {}
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
    const newMessage = {
      from: this.props.userId,
      time: new Date()
      body: this.state.message

    }
    
    const newSession = {
      date: moment(this.state.date),
      duration: this.state.duration,
      messages: this.props.messages.concat(newMessage),
      description: this.props.description
    }

    // validate ish
    const validation = validateSessionSubmit(newSession)
    console.log(validation)
    if(validation.isValid) {
      // send the update

      console.log(newSession)
    }
    // create an object with the updated keys
      // id
    // send them to an endpoint to update
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
        <button onClick={this.handleScheduler}>{this.state.schedulerOpen ? 'Cancel' : 'Suggest a new time'  }
        </button>}
        <p>Category: {category}</p>
        <p>Description: {description}</p>
        {attachment && <div style={{backgroundImage: `url(${attachment})`,
          width: '100px',
          height: '100px',
          backgroundSize: 'cover',
          marginBottom: '20px'
        }} />}
        <p style={{ textTransform: 'capitalize' }}>Status: {status}</p>
        {(status === 'pending' || status === 'upcoming') && <button onClick={this.cancelSession} style={{ marginBottom: '20px'}}>Cancel Session</button>}
        <p>{messages}</p>
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
        <h2>Add a Message</h2>
        <textarea onChange={this.onTextChange} style={{ marginBottom: '30px' }} maxLength="250"/>
        {status === 'pending' && <Button onClick={this.onSubmit}>Send Update</Button>}
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
    }

    this.handleModal = this.handleModal.bind(this)
  }

  componentDidMount() {
    const { _id, accountType } = this.props.user

    getSessions(_id, accountType)
    .then((res) => {
      const sessions = res.data.map((session) => {
        session['hourlyRate'] = session.artist.hourlyRate
        session.artist = session.artist.username
        session.pupil = session.pupil.username
        return session
      })

      this.setState({ sessions })
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps !== prevState) {
      return nextProps
    }
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

    return (
      <div className={cn("sessions", "center-module")}>
        <h2>UPCOMING SESSIONS</h2>
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
        <h2>COMPLETED SESSIONS</h2>
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
              userId={this.state.user.id}
            { ...this.state.sessionInView }/>
          </Modal>}
      </div>
    )
  }
}

Sessions.propTypes = {

}

const mapStateToProps = state => ({ user: state.auth.user, profile: state.profile })

export default connect(mapStateToProps, { getSessions })(Sessions)
