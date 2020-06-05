import React, { Component } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import validateSessionSubmit from '../validation/sessionSubmit'
import { deleteSession } from '../actions/session'
import moment from 'moment'
import axios from 'axios'

class EditSession extends Component {
  constructor(props) {
    super(props)
    this.textArea = React.createRef()
    this.confirmApproval = React.createRef()

    this.state = {
      schedulerOpen: false,
      date: this.props.date,
      duration: this.props.duration,
      message: '',
      showSubmitError: false,
      errors: {},
      submitReady: false,
      displayBanner: false,
      bannerMessage: 'Your update has been sent',
      showSummary: true,
    }

    this.handleScheduler = this.handleScheduler.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.deleteSession = this.deleteSession.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  handleScheduler() {
    this.setState({
      schedulerOpen: !this.state.schedulerOpen,
    })
  }

  onChange(date) {
    if(!moment(date).isSame(this.props.date)) {
      this.setState({ date, submitReady: true })
    } else {
      if(this.state.duration === this.props.duration && this.state.message === null) this.setState({ submitReady: false })
    }
  }

  handleBanner() {
    this.setState({ displayBanner: !this.state.displayBanner })
    Router.push('/account/my-sessions')
  }

  onSubmit() {
    if(this.props.isPupil ||this.confirmApproval.current.checked) {
      this.setState({ loading: true })

      let newSession = {
        _id: this.props._id,
        isPupil: this.props.isPupil,
        date: moment(this.state.date),
        duration: this.state.duration,
        description: this.props.description,
        contractChange: this.state.submitReady
      }

      const validation = validateSessionSubmit(newSession)
      if(validation.isValid) {
        axios.post('/api/sessions/update', newSession)
        .then((res) => {
          // Add check for response code
          if(res.data.n === 1) {
            this.setState({ errors: {}})
            this.props.showSubmit(newSession)
            setTimeout(() =>  { this.setState({ loading: false, displayBanner: true })}, 2000)
            const notify = this.props.isPupil ? this.props.artist : this.props.pupil
            axios.post('/api/emails/sessionUpdated', { notify })
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
    } else {
      this.setState({ errors: { confirm: true }})
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
    const {
      artist,
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
      status,
      artistApproved,
    } = this.props

    const showPaymentButton = isPupil && artistApproved && status === 'pending'

    return (
      <div className="edit-session-modal">
        {this.state.showSubmitError && <div>Something went wrong, try again later</div>}
        <h1>Edit Session</h1>
        <p>{isPupil ? `Artist: ${artist}` : `Pupil: ${pupil}`}</p>
        <p id="time-display" style={{ marginRight: '10px' }}>Time: {formatTime(date, duration)}</p>
        {status === 'pending' &&
        <button
          className="small-button"
          onClick={this.handleScheduler}>{this.state.schedulerOpen ? 'Cancel' : 'Request a new time' }
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
            value={this.state.duration}>
            <option value="30">{`30 min: $${calcTotal("30 min", hourlyRate)}`}</option>
            <option value="60">{`1 hour: $${calcTotal("1 hour", hourlyRate)}`}</option>
            <option value="90">{`1 hour 30 min: $${calcTotal("1 hour 30 min", hourlyRate)}`}</option>
            <option value="120">{`2 hours: $${calcTotal("2 hours", hourlyRate)}`}</option>
          </select>
        </div>}
        <p style={{ marginTop: "10px" }}>Category: {category}</p>
        <p>Description: {description}</p>
        {attachment && <div style={{ backgroundImage: `url(${attachment})`,
          width: '100px',
          height: '100px',
          backgroundSize: 'cover',
          marginBottom: '20px'
        }} />}
        <p style={{ textTransform: 'capitalize', display: 'inline-block', marginRight: '10px'}}>Status: {status}</p>
        {(status === 'pending' || status === 'upcoming') && <button className="small-button"
          onClick={() => { this.props.changeModal('confirm')}} style={{ marginBottom: '20px'}}>Cancel Session</button>}
        {status !== 'cancelled' && status !== 'expired' && !isPupil && <div className="confirm-approval">
          <input ref={this.confirmApproval} id="confirmApproval" type="checkbox" /><label htmlFor="confirmApproval">If the pupil pays for this modified session you have to do it or else</label>
        </div>}
        {this.state.errors.confirm && (<div className="invalid-feedback">You must confirm first</div>)}
        <Button disabled={!this.state.submitReady} onClick={this.onSubmit}>Submit Change</Button>
        {(status === 'cancelled'|| status === 'expired') && <Button onClick={this.deleteSession}>Delete Session</Button>}
        {this.state.displayBanner && <Banner
          style={{ zIndex: 5, minHeight: '100px' }}
          handleBanner={this.handleBanner}>
            {this.state.bannerMessage}
          </Banner>}
      </div>
    )
  }
}

export default EditSession
