import React, { Component } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import validateSessionSubmit from '../validation/sessionSubmit'
import { deleteSession } from '../actions/session'
import moment from 'moment'
import axios from 'axios'

class EditSession extends Component {
  constructor(props) {
    super(props)
    this.textArea = React.createRef()

    this.state = {
      schedulerOpen: false,
      date: this.props.date,
      duration: this.props.duration,
      message: '',
      showSubmitError: false,
      errors: {},
      submitReady: false,
      displayBanner: false,
      bannerMessage: 'Your update has been sent'
    }

    this.handleScheduler = this.handleScheduler.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
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
    if(!date.isSame(this.props.date)) {
      this.setState({ date, submitReady: true })
    } else {
      if(this.state.duration === this.props.duration && this.state.message === null) this.setState({ submitReady: false })
    }
  }

  handleBanner() {
    this.setState({ displayBanner: !this.state.displayBanner })
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
    if(newMessage.body !== '') newSession.messages = this.props.messages.concat(newMessage)

    const validation = validateSessionSubmit(newSession)
    if(validation.isValid) {
      axios.post('/api/sessions/update/', newSession)
      .then((res) => {
        // Add check for response code
        this.textArea.current.value = ''
        if(res.data.n === 1) {
          this.props.showSubmit(newSession)
          setTimeout(() =>  { this.setState({ loading: false, displayBanner: true })}, 2000)
          axios.post('/api/emails/sessionUpdated')
        } else {
          setTimeout(() =>  { this.setState({ loading: false })}, 2000)
          this.setState({ showSubmitError: true })
        }
      })
      .catch((err) => {
        console.log('err from session update', err)
        setTimeout(() =>  { this.setState({ loading: false })}, 2000)
        this.setState({ showSubmitError: true })
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
        if(res.status === 200) {
          Router.push('/account/my-sessions')
        }
      })
    }
  }

  onTextChange(e) {
    const newMessage = e.target.value

    this.setState({
      message: e.target.value
    })

    if(newMessage !== '') {
      this.setState({ submitReady: true })
    } else {
      if(moment(this.state.date).isSame(this.props.date) && this.props.duration === this.state.duration)this.setState({ submitReady: false })
    }
  }

  onSelect(e) {
    e.preventDefault()
    this.setState({ duration: e.target.value})

    if(e.target.value !== this.props.duration) {
      this.setState({ submitReady: true })
    } else {
      if(moment(this.state.date).isSame(this.props.date) && this.state.message === null) this.setState({ submitReady: false })
    }
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
        {this.state.showSubmitError && <div>Something went wrong, try again later</div>}
        <h1>Manage Session</h1>
        <p>{isPupil ? `Artist: ${artist}` : `Pupil: ${pupil}`}</p>
        <p id="time-display">Time: {formatTime(date, duration)}</p>
        {status === 'pending' &&
        <button className="small-button" onClick={this.handleScheduler}>{this.state.schedulerOpen ? 'Cancel' : 'Request a new time'  }
        </button>}
        {this.state.schedulerOpen && <div className="session-scheduler">
        <h2>CHOOSE TIME</h2>
          <Datetime
            isValidDate={validDateSelection}
            inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
            onChange={this.onChange}
          />
          <h2>SESSION DURATION</h2>
          <select
            onChange={this.onSelect}
            name="duration"
            value={this.state.duration}
          >
            <option value="30">{`30 min: $${calcTotal("30 min", hourlyRate)}`}</option>
            <option value="60">{`1 hour: $${calcTotal("1 hour", hourlyRate)}`}</option>
            <option value="90">{`1 hour 30 min: $${calcTotal("1 hour 30 min", hourlyRate)}`}</option>
            <option value="120">{`2 hours: $${calcTotal("2 hours", hourlyRate)}`}</option>
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
        {messages && messages.length > 0 &&
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
        {(status !== 'cancelled' && status !== 'expired') &&
          <React.Fragment>
            <h2>Add a Message</h2>
            <textarea ref={this.textArea} onChange={this.onTextChange} style={{ marginBottom: '30px' }} maxLength="250"/>
          </React.Fragment>
        }
        {status === 'pending' && <Button disabled={!this.state.submitReady} onClick={this.onSubmit}>{this.state.loading ? 'Loading' : 'Send Update'}</Button>}
        {(status === 'cancelled'|| status === 'expired') && <Button onClick={this.deleteSession}>Delete Session</Button>}
        {this.state.displayBanner && <Banner handleBanner={this.handleBanner}>{this.state.bannerMessage}</Banner>}
      </div>
    )
  }
}

export default EditSession
